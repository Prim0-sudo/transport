import {workspaceKey,port} from './preview-common.mjs';
import { createReadStream, readFileSync, readdirSync, statSync, watch } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, relative as relativePath } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../site/dist/", import.meta.url)));
const reviewRoot = resolve(root, "../../review");
const landingAssetsRoot = resolve(root, "../../artwork/landing/miniature-world-v1");
const liveClients = new Set();
const bootId = String(Date.now());
const liveReload = `<script>
  (() => {
    window.__TRANSPORT_LOCAL_PREVIEW__ = true;
    const changes = new EventSource("/__live");
    let boot;
    changes.addEventListener("ready", event => {
      const next = JSON.parse(event.data);
      if (boot && boot !== next) window.location.reload();
      boot = next;
    });
    changes.addEventListener("change", (event) => {
      const paths = JSON.parse(event.data).filter(path => path.startsWith("landing") || path.startsWith("images/landing/") || path.startsWith("review/") === location.pathname.startsWith("/review/"));
      if (!paths.length) return;
      if (paths.every(path => path.endsWith(".css"))) {
        for (const path of paths) {
        const sheet = [...document.querySelectorAll('link[rel="stylesheet"]')]
          .find((link) => new URL(link.href).pathname.endsWith("/" + path));
        if (sheet) {
          const next = new URL(sheet.href);
          next.searchParams.set("live", Date.now());
          sheet.href = next.href;
        }
        }
        return;
      }
      window.location.reload();
    });
  })();
</script>`;
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg", ".m4a": "audio/mp4",
  ".mp4": "video/mp4", ".webm": "video/webm", ".vtt": "text/vtt; charset=utf-8", ".pdf": "application/pdf"
};

createServer((request, response) => {
  let requested;
  try { requested = decodeURIComponent((request.url || "/").split("?")[0]); }
  catch { response.writeHead(400).end("Bad request"); return; }
  if (requested === "/__health") {
    response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    response.end(JSON.stringify({ app: "transport-town", root, port, pid: process.pid, workspaceKey, local: true }));
    return;
  }
  if (requested === "/__live") {
    response.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    response.write(`event: ready\ndata: ${JSON.stringify(bootId)}\n\n`);
    liveClients.add(response);
    request.on("close", () => liveClients.delete(response));
    return;
  }
  const isReview = requested === "/review/" || requested.startsWith("/review/");
  const isAssetReview = requested.startsWith("/review/landing-assets/");
  const servingRoot = isAssetReview ? landingAssetsRoot : isReview ? reviewRoot : root;
  const relative = isAssetReview ? requested.slice("/review/landing-assets/".length) || "index.html" : isReview ? requested.slice("/review/".length) || "index.html" : requested === "/" ? "index.html" : requested.replace(/^\/+/, "");
  const path = normalize(join(servingRoot, relative));

  const safeRelative = relativePath(servingRoot, path).replaceAll("\\", "/");
  const allowed = isAssetReview ? /^(index\.html|manifest\.json|(?:sky|distant-background|middle-ground|foreground|bus|train|train-front|ferry|airplane|cloud)\.png)$/ : isReview ? /^(index\.html|style\.css|shell\.js|scene\.png|dispatch\.html|gsap\.min\.js|MotionPathPlugin\.min\.js)$/ : /^(index\.html|(?:app|lifecycle|landing-scene|curriculum|classroom-core|standard-data|standard-views|media-views|teaching-bounds|detective-model|detective-view)\.js|(?:styles|landing|classroom|standard)\.css|vendor\/(?:gsap|MotionPathPlugin)\.min\.js|transport-town-bg\.png|images\/[^.].*|printables\/[^.].*|phonics\/[^.].*)$/;
  if (!allowed.test(safeRelative) || safeRelative.split("/").some(part => part.startsWith("."))) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const stat=statSync(path);
    if (!stat.isFile()) throw new Error("Not a file");
    const extension=extname(path).toLowerCase(),type=types[extension]||'application/octet-stream';
    const headers={'Cache-Control':'no-store','Content-Type':type};
    const ranged=type.startsWith('audio/')||type.startsWith('video/');
    if(ranged)headers['Accept-Ranges']='bytes';
    if(ranged&&request.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      const start=match?.[1]?Number(match[1]):Math.max(0,stat.size-Number(match?.[2]));
      const end=match?.[1]&&match[2]?Math.min(stat.size-1,Number(match[2])):stat.size-1;
      if(!match||(!match[1]&&!match[2])||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=stat.size){
        response.writeHead(416,{...headers,'Content-Range':`bytes */${stat.size}`}).end();return;
      }
      response.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});
      if(request.method==='HEAD')response.end();else createReadStream(path,{start,end}).pipe(response);
      return;
    }
    if(extension!=='.html')headers['Content-Length']=stat.size;
    response.writeHead(200,headers);
    if(request.method==='HEAD'){response.end();return;}
    if (extension === ".html") {
      response.end(readFileSync(path, "utf8").replace("</body>", `${liveReload}</body>`));
    } else {
      createReadStream(path).pipe(response);
    }
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Transport Town game running at http://127.0.0.1:${port}/`);
});

const signatures = new Map();
const pending = new Set();
const signature = path => { try { const stat = statSync(join(root, path)); return stat.isFile() ? `${stat.mtimeMs}:${stat.size}` : null; } catch { return null; } };
function seed(folder) {
  for (const entry of readdirSync(join(root, folder), { withFileTypes: true })) {
    const path = `${folder}/${entry.name}`;
    if (entry.isDirectory()) seed(path);
    else signatures.set(path, signature(path));
  }
}
for (const folder of ["images"]) seed(folder);
for(const path of ['index.html','app.js','lifecycle.js','styles.css','landing.css','landing-scene.js','curriculum.js','classroom-core.js','classroom.css','standard.css','standard-data.js','standard-views.js','media-views.js','detective-model.js','detective-view.js'])signatures.set(path,signature(path));
let changeTimer;
watch(root, { recursive: true }, (_event, filename) => {
  if (!filename) return;
  const path = String(filename).replaceAll("\\", "/");
  if (!/^(index\.html$|(?:app|lifecycle|landing-scene|curriculum|classroom-core|standard-data|standard-views|media-views|detective-model|detective-view)\.js$|(?:styles|landing|classroom|standard)\.css$|images\/)/.test(path)) return;
  const next = signature(path);
  if (signatures.get(path) === next) return;
  signatures.set(path, next);
  pending.add(path);
  clearTimeout(changeTimer);
  changeTimer = setTimeout(() => {
    const paths = [...pending];
    pending.clear();
    for (const client of liveClients) client.write(`event: change\ndata: ${JSON.stringify(paths)}\n\n`);
  }, 250);
});

// Review-only source has its own URL space; edits never reload the learner app.
watch(reviewRoot, (_event, filename) => {
  if (!filename || !/^(index\.html|style\.css|shell\.js|scene\.png|dispatch\.html)$/.test(String(filename))) return;
  const key = `review/${filename}`;
  let next; try { const stat = statSync(join(reviewRoot, String(filename))); next = `${stat.mtimeMs}:${stat.size}`; } catch { next = null; }
  if (signatures.get(key) === next) return;
  signatures.set(key, next); pending.add(key); clearTimeout(changeTimer);
  changeTimer = setTimeout(() => { const paths = [...pending]; pending.clear(); for (const client of liveClients) client.write(`event: change\ndata: ${JSON.stringify(paths)}\n\n`); }, 250);
});
