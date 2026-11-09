/* Transport-specific adapter of Plants DetectiveView. Owns image callbacks,
 * active-time work and resize observation; never paints the whole environment.
 */
(() => {
  class TransportDetectiveView {
    constructor({root,item,choices,reveal,clock,held,onSolved,onPractice,onSave,onWrong=()=>{}}){
      Object.assign(this,{root,item,choices,reveal,clock,held,onSolved,onPractice,onSave,onWrong});
      this.active=true;this.last=null;this.savedSecond=-1;
      const kinds={mosaic:'Mosaic reveal',pixel:'Pixel reveal',silhouette:'Silhouette'};
      root.innerHTML=`<div class="standard-settings detective-settings detective-round-settings"><label>Reveal <select disabled aria-label="Reveal type"><option>${kinds[reveal.kind]}</option></select></label><label>Time <select disabled aria-label="Reveal duration"><option>${reveal.duration} seconds</option></select></label></div><div class="detective-workspace"><div class="detective-picture" role="img" aria-label="Hidden Transport picture"><canvas aria-hidden="true"></canvas><div class="detective-mosaic" aria-hidden="true"></div></div><div class="detective-controls"><p class="detective-time" aria-live="off"></p><div class="standard-actions learn-actions"><button class="standard-action" data-reveal-start>Start reveal</button><button class="standard-action" data-reveal-guess>Guess</button><button class="standard-action" data-reveal-full>Reveal picture</button></div><div class="detective-choices" hidden></div><p class="detective-status" role="status"></p><button data-reveal-practice hidden>Next picture · practice</button></div></div>`;
      this.picture=root.querySelector('.detective-picture');this.canvas=root.querySelector('canvas');this.grid=root.querySelector('.detective-mosaic');
      for(let i=0;i<120;i++){const tile=document.createElement('i');tile.dataset.cover=i;this.grid.append(tile);}
      const answers=root.querySelector('.detective-choices');
      for(const choice of choices){const button=document.createElement('button');button.className='answer-btn';button.dataset.choiceId=choice.id;button.textContent=choice.name;button.disabled=reveal.disabledIds.includes(choice.id);button.onclick=()=>{
        if(!this.active||this.held||reveal.complete)return;
        this.halt();
        const correct=choice.id===item.id,reward=TransportReveal.answer(reveal,correct);
        if(!correct){button.disabled=true;button.classList.add('wrong');reveal.disabledIds.push(choice.id);this.onWrong();this.onSave();return;}
        this.status('');this.paint();this.controls();this.onSolved(reward);
      };answers.append(button);}
      root.querySelector('[data-reveal-start]').onclick=()=>{if(this.held||reveal.complete)return;if(reveal.running){this.halt();reveal.running=false;}else{reveal.guessing=false;reveal.running=true;this.start();}this.controls();this.onSave();};
      root.querySelector('[data-reveal-guess]').onclick=()=>{if(this.held||reveal.complete)return;this.halt();reveal.running=false;reveal.guessing=true;this.controls();this.onSave();};
      root.querySelector('[data-reveal-full]').onclick=()=>{if(this.held||reveal.complete)return;this.halt();reveal.running=false;reveal.assisted=true;reveal.guessing=true;reveal.elapsed=reveal.duration*1000;this.paint();this.controls();this.status('Picture revealed for practice. No guessing star for this picture.');this.onSave();};
      root.querySelector('[data-reveal-practice]').onclick=()=>{if(this.held||reveal.complete)return;this.halt();reveal.complete=true;reveal.running=false;reveal.assisted=true;this.onPractice();};
      this.image=new Image();
      this.image.onload=()=>{if(!this.active)return;this.measureCrop();this.paint();this.controls();if(reveal.running)this.start();};
      this.image.onerror=()=>{if(!this.active)return;this.halt();reveal.running=false;reveal.assisted=true;reveal.elapsed=reveal.duration*1000;this.status('The picture could not load. Skip this picture for practice.');this.controls();this.onSave();};
      this.image.src=(reveal.kind==='silhouette'&&item.cutout)||item.image;
      this.resize=new ResizeObserver(()=>{if(this.active)this.paint();});this.resize.observe(this.picture);
      this.controls();this.paint();
    }
    measureCrop(){
      const image=this.image,c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
      try{const pixels=ctx.getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=0,y1=0;
        for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(pixels[(y*c.width+x)*4+3]>16){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
        const p=Math.ceil(Math.max(x1-x0,y1-y0)*.035);x0=Math.max(0,x0-p);y0=Math.max(0,y0-p);x1=Math.min(c.width,x1+p+1);y1=Math.min(c.height,y1+p+1);this.crop=[x0,y0,Math.max(1,x1-x0),Math.max(1,y1-y0)];
      }catch{this.crop=[0,0,c.width,c.height];}
    }
    status(text){this.root.querySelector('.detective-status').textContent=text;}
    controls(){
      const r=this.reveal,full=r.elapsed>=r.duration*1000||r.complete;
      const start=this.root.querySelector('[data-reveal-start]');start.textContent=r.running?'Stop reveal':r.elapsed?'Continue reveal':'Start reveal';start.disabled=r.complete||full||r.kind==='silhouette'||!this.image?.naturalWidth;
      this.root.querySelector('[data-reveal-guess]').disabled=r.complete;
      this.root.querySelector('[data-reveal-full]').disabled=r.complete||full;
      this.root.querySelector('.detective-choices').hidden=!r.guessing||r.complete;
      this.root.querySelector('[data-reveal-practice]').hidden=!r.assisted||r.complete;
    }
    paint(){
      if(!this.active)return;const r=this.reveal,full=r.complete||r.elapsed>=r.duration*1000;
      const rect=this.picture.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2),width=Math.max(1,Math.round(rect.width*ratio)),height=Math.max(1,Math.round(rect.height*ratio));
      if(this.canvas.width!==width)this.canvas.width=width;if(this.canvas.height!==height)this.canvas.height=height;
      const ctx=this.canvas.getContext('2d');ctx.clearRect(0,0,width,height);
      if(this.crop&&this.image.naturalWidth){const [sx,sy,sw,sh]=this.crop,scale=Math.min(width/sw,height/sh)*.96,w=sw*scale,h=sh*scale,left=(width-w)/2,top=(height-h)/2;
        if(r.kind==='pixel'&&!full){const size=Math.max(3,Math.round(3+Math.pow(r.elapsed/(r.duration*1000),2)*110));const small=this.small||(this.small=document.createElement('canvas'));small.width=size;small.height=Math.max(1,Math.round(size*sh/sw));small.getContext('2d').drawImage(this.image,sx,sy,sw,sh,0,0,small.width,small.height);ctx.imageSmoothingEnabled=false;ctx.drawImage(small,left,top,w,h);}
        else{ctx.imageSmoothingEnabled=true;ctx.drawImage(this.image,sx,sy,sw,sh,left,top,w,h);}
        Object.assign(this.grid.style,{left:`${left/width*100}%`,top:`${top/height*100}%`,width:`${w/width*100}%`,height:`${h/height*100}%`});
      }
      this.canvas.style.filter=r.kind==='silhouette'&&!full?'brightness(0)':'';
      this.grid.hidden=r.kind!=='mosaic'||full;
      const revealed=new Set(r.order.slice(0,TransportReveal.count(r)));for(const tile of this.grid.children)tile.style.visibility=revealed.has(Number(tile.dataset.cover))?'hidden':'visible';
      this.picture.setAttribute('aria-label',full?this.item.alt:'Hidden Transport picture');
      this.root.querySelector('.detective-time').textContent=r.complete?'Picture solved':r.kind==='silhouette'?'Use the outline as your clue':`${Math.ceil((r.duration*1000-r.elapsed)/1000)} seconds of reveal remaining${r.assisted?' · Practice':''}`;
      this.picture.dataset.revealed=TransportReveal.count(r);
    }
    flush(){if(this.last!==null){const now=performance.now();TransportReveal.advance(this.reveal,now-this.last);this.last=now;}}
    start(){if(!this.active||this.held||!this.reveal.running||this.reveal.kind==='silhouette'||!this.image.naturalWidth)return;this.clock.cancelTask(this.job);this.last=performance.now();this.job=this.clock.schedule(()=>this.tick(),50);}
    tick(){if(!this.active||this.held)return;this.flush();this.paint();this.controls();const second=Math.floor(this.reveal.elapsed/1000);if(second!==this.savedSecond){this.savedSecond=second;this.onSave();}if(this.reveal.running)this.job=this.clock.schedule(()=>this.tick(),50);else{this.last=null;if(this.reveal.assisted)this.status('The picture is fully revealed. Continue as practice.');}}
    halt(){this.flush();this.last=null;this.clock.cancelTask(this.job);}
    setHeld(held){if(held)this.halt();this.held=held;if(!held&&this.reveal.running)this.start();}
    destroy(){this.halt();this.active=false;this.resize.disconnect();this.image.onload=this.image.onerror=null;}
  }
  globalThis.TransportDetectiveView=TransportDetectiveView;
})();
