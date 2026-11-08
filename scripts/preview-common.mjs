import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const portIndex=process.argv.indexOf('--port');
export const port=Number(portIndex>=0?process.argv[portIndex+1]:process.env.TRANSPORT_PREVIEW_PORT||process.env.PORT||4251);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid preview port');
export const url=`http://127.0.0.1:${port}/`;
export const workspaceKey=crypto.createHash('sha256').update(root.toLowerCase()).digest('hex').slice(0,16);
export const work=path.join(root,'.preview');
export function isOurPreview(result){return result.health?.app==='transport-town'&&result.health.workspaceKey===workspaceKey;}
export function probePreview(){
  return new Promise(resolve=>{
    const request=http.get(url+'__health',response=>{
      let body='';
      response.on('data',chunk=>{body+=chunk;if(body.length>4096)response.destroy();});
      response.on('error',()=>resolve({reachable:true,health:null}));
      response.on('end',()=>{let health=null;try{health=JSON.parse(body);}catch{}resolve({reachable:true,health});});
    });
    request.setTimeout(1200,()=>request.destroy());
    request.on('error',()=>resolve({reachable:false,health:null}));
  });
}
