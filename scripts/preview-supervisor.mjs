import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {root,work,port,url,workspaceKey,probePreview,isOurPreview} from './preview-common.mjs';

fs.mkdirSync(work,{recursive:true});
const stateFile=path.join(work,`preview-${port}.json`);
let child=null,stopping=false,restarts=0,misses=0,busy=false,retry;
const log=message=>fs.appendFileSync(path.join(work,'preview-supervisor.log'),`${new Date().toISOString()} ${message}\n`);
const state=(status,extra={})=>fs.writeFileSync(stateFile,JSON.stringify({workspaceKey,url,port,supervisorPid:process.pid,serverPid:child?.pid||null,restarts,status,updatedAt:new Date().toISOString(),...extra},null,2)+'\n');
const stdout=fs.openSync(path.join(work,'preview.log'),'a');
const stderr=fs.openSync(path.join(work,'preview-error.log'),'a');
async function boot(){
  if(stopping||child)return;
  const existing=await probePreview();
  if(existing.reachable){
    log(isOurPreview(existing)?'Another Transport Town server already owns the preview; duplicate supervisor exits.':'Preview port belongs to another service; leaving that service untouched.');
    stopping=true;clearInterval(watchdog);process.exitCode=isOurPreview(existing)?0:1;return;
  }
  child=spawn(process.execPath,[path.join(root,'scripts/serve.mjs'),'--port',String(port)],{cwd:root,windowsHide:true,env:{...process.env,TRANSPORT_PREVIEW_PORT:String(port)},stdio:['ignore',stdout,stderr]});
  const running=child;misses=0;state('starting');log(`Started server ${running.pid} on ${url}`);
  running.once('error',error=>log(`Server launch error: ${error.message}`));
  running.once('close',(code,signal)=>{
    if(child!==running)return;
    child=null;log(`Server ${running.pid} exited (${code??signal}).`);
    if(stopping)return;
    restarts++;state('restarting');retry=setTimeout(boot,Math.min(1000*restarts,10000));
  });
}
const watchdog=setInterval(async()=>{
  if(stopping||busy||!child)return;busy=true;
  const running=child;
  try{
    const result=await probePreview();
    if(child!==running||stopping)return;
    if(isOurPreview(result)&&result.health.pid===running.pid){misses=0;state('ready');}
    else if(++misses>=3){log(`Server ${running.pid} failed three health checks; restarting owned child.`);running.kill();}
  }finally{busy=false;}
},3000);
for(const signal of ['SIGINT','SIGTERM','SIGBREAK'])process.on(signal,()=>{log(`Supervisor ${process.pid} received ${signal}; stopping owned preview.`);stopping=true;clearInterval(watchdog);clearTimeout(retry);state('stopped',{stopReason:signal});child?.kill();});
process.on('exit',code=>log(`Supervisor ${process.pid} exited (${code}).`));
state('starting');await boot();
