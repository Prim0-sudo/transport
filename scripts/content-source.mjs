// Read the authored static data without booting the DOM application.
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
export async function readTransportContent(root=new URL('../',import.meta.url)) {
  const context=vm.createContext({});
  for(const name of ['curriculum.js','standard-data.js'])vm.runInContext(await readFile(new URL(`site/dist/${name}`,root),'utf8'),context,{filename:name});
  const app=await readFile(new URL('site/dist/app.js',root),'utf8');
  const boundary=app.indexOf('const classroom = new TransportClassroom(');
  if(boundary<0)throw Error('Review the authoring adapter: app content boundary changed.');
  vm.runInContext(app.slice(0,boundary)+'\nglobalThis.authored={vehicles,safetyQuestions};',context,{filename:'app-content.js'});
  return {entries:JSON.parse(JSON.stringify(context.authored.vehicles)),questions:JSON.parse(JSON.stringify(context.authored.safetyQuestions)),rules:context.TransportStandard.sortRules};
}
