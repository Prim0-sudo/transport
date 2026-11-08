import fs from 'node:fs';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {root,work,port,url,probePreview,isOurPreview} from './preview-common.mjs';

let existing=await probePreview();
if(process.argv.includes('--restart')){
 if(!isOurPreview(existing))throw Error('Only this workspace\'s running preview can be refreshed.');
 const previousPid=existing.health.pid;
 process.kill(previousPid);
 for(let attempt=0;attempt<48;attempt++){
  await delay(250);existing=await probePreview();
  if(isOurPreview(existing)&&existing.health.pid!==previousPid)break;
 }
 if(!isOurPreview(existing)||existing.health.pid===previousPid)throw Error('The owned preview has not recovered yet; its existing supervisor remains responsible for recovery.');
}
if(process.argv.includes('--status')){
  console.log(JSON.stringify({ready:isOurPreview(existing),url,...existing.health},null,2));
  if(!isOurPreview(existing))process.exitCode=1;
}else if(isOurPreview(existing)){
  console.log(`Transport Town is ready: ${url} (existing server ${existing.health.pid})`);
}else if(existing.reachable){
  throw new Error(`${url} belongs to another service. No process was stopped and no alternate preview URL was substituted.`);
}else{
  fs.mkdirSync(work,{recursive:true});
  const supervisor=path.join(root,'scripts/preview-supervisor.mjs');
  if(process.platform==='win32'){
    const quotePS=value=>"'"+value.replaceAll("'","''")+"'";
    const command=`"${process.execPath}" "${supervisor}" --port ${port}`;
    const script=`$ErrorActionPreference='Stop'; $townStartup=New-CimInstance -CimClass (Get-CimClass -ClassName Win32_ProcessStartup) -ClientOnly -Property @{ShowWindow=[uint16]0; CreateFlags=[uint32]16777224}; $townCreated=Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{CommandLine=${quotePS(command)}; CurrentDirectory=${quotePS(root)}; ProcessStartupInformation=$townStartup}; if($townCreated.ReturnValue -ne 0){throw ('Preview launch failed: '+$townCreated.ReturnValue)}; Write-Output $townCreated.ProcessId`;
    const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{windowsHide:true,encoding:'utf8',timeout:15000});
    if(result.error||result.status!==0)throw new Error(result.error?.message||result.stderr.trim()||'Preview supervisor launch failed');
  }else{
    const processHandle=spawn(process.execPath,[supervisor,'--port',String(port)],{cwd:root,detached:true,stdio:'ignore'});processHandle.unref();
  }
  let ready=false;
  for(let attempt=0;attempt<40;attempt++){
    const result=await probePreview();
    if(isOurPreview(result)){console.log(`Transport Town is ready: ${url} (server ${result.health.pid}; automatic recovery enabled)`);ready=true;break;}
    await delay(250);
  }
  if(!ready)throw new Error(`Preview did not become ready at ${url}. See  .preview/preview-error.log and .preview/preview-supervisor.log.`);
}
