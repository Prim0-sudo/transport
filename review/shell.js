const pages={launch:document.getElementById('launch'),menu:document.getElementById('menu'),games:document.getElementById('games'),activity:document.getElementById('activity')};
const frame=document.getElementById('dispatchFrame'),teacher=document.getElementById('teacherPanel');
let current='launch';
const modes=[
 ['Meet the Words',['car','bus','train']],['Sort It',['bicycle','boat','airplane']],['Detective',['helicopter']],['Which One Is It?',['bus','ferry','airplane']],
 ['Knowledge & Safety',['police_car','ambulance']],['Transport Spelling',['truck']],['Flip the Tiles',['car','car']],['Spin the Wheel',['bicycle','ferry','helicopter']],
 ['Media',['train','boat']],['Transport Games',['bus','car']],['Phonics & Sight Words',['tram']],['Read, Draw & Talk',['hot_air_balloon']]
];
const grid=document.getElementById('modeGrid');
for(const [label,images] of modes){
 const tile=document.createElement(label==='Transport Games'?'button':'article');tile.className='mode';
 if(label==='Transport Games'){tile.classList.add('mode-button');tile.addEventListener('click',()=>show('games'));}
 const art=document.createElement('span');art.className='mode-art';art.setAttribute('aria-hidden','true');
 for(const slug of images){const image=document.createElement('img');image.src=`/images/emoji-codex/${slug}.png`;image.alt='';art.append(image);}
 const title=document.createElement('strong');title.textContent=label;tile.append(art,title);grid.append(tile);
}
function show(name){
 if(current==='activity'&&name!=='activity')frame.removeAttribute('src');
 Object.entries(pages).forEach(([id,page])=>page.hidden=id!==name);
 current=name;
 if(name==='activity'&&!frame.hasAttribute('src'))frame.src='/review/dispatch.html';
 document.getElementById('home').hidden=name==='launch';
 window.scrollTo({top:0,behavior:'instant'});
 const target=pages[name].querySelector('h1');if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
}
document.getElementById('explore').addEventListener('click',()=>show('menu'));
document.getElementById('home').addEventListener('click',()=>show('launch'));
document.getElementById('featuredDispatch').addEventListener('click',()=>show('activity'));
document.getElementById('dispatchChoice').addEventListener('click',()=>show('activity'));
document.querySelectorAll('[data-back]').forEach(button=>button.addEventListener('click',()=>show('menu')));
document.getElementById('sound').addEventListener('click',event=>{const on=event.currentTarget.getAttribute('aria-pressed')!=='true';event.currentTarget.setAttribute('aria-pressed',String(on));event.currentTarget.textContent=on?'Sound on':'Sound off';});
document.getElementById('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}});
document.getElementById('teacher').addEventListener('click',()=>{
 const child=current==='activity'?frame.contentDocument?.querySelector('[data-action=teacher]'):null;
 if(child)child.click();else teacher.showModal();
});
document.getElementById('closeTeacher').addEventListener('click',()=>teacher.close());
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!teacher.open&&!document.fullscreenElement){if(current==='activity'||current==='games')show('menu');else if(current==='menu')show('launch');}});
window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===frame.contentWindow&&event.data?.type==='transport-review-height'){const height=Number(event.data.height);if(Number.isFinite(height))frame.style.height=`${Math.max(500,Math.min(1800,height))}px`;}});
show('launch');
