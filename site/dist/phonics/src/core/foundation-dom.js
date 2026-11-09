// Minimal topic-neutral adapter for the shared Our Town foundations controller.
export function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
export function button(label,fn,cls='button'){const b=el('button',cls,label);b.type='button';b.addEventListener('click',fn);return b;}
