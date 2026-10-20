'use strict';
(() => {
  const root=document.documentElement;
  const themeButton=document.getElementById('theme-toggle');
  function applyTheme(theme){
    root.dataset.theme=theme;root.style.colorScheme=theme;
    const light=theme==='light';
    themeButton.setAttribute('aria-pressed',String(light));
    themeButton.setAttribute('aria-label',light?'切换到深色主题':'切换到浅色主题');
    themeButton.title=light?'切换到深色主题':'切换到浅色主题';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#f2efe5':'#151715');
  }
  applyTheme(root.dataset.theme||'dark');
  themeButton.addEventListener('click',()=>{const theme=root.dataset.theme==='light'?'dark':'light';applyTheme(theme);try{localStorage.setItem('rx-theme',theme);}catch{}});
  const routes=new Map([['index.html','首页'],['projects.html','作品'],['humanities.html','人文'],['about.html','关于'],['contact.html','联系']]);
  const current=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('header nav a').forEach(link=>{if(new URL(link.href).pathname.split('/').pop()===current)link.setAttribute('aria-current','page');});
  const overlay=document.getElementById('page-transition');
  const svgNS='http://www.w3.org/2000/svg';
  let teeth='';
  // A sawtooth ratchet: a gradual ramp followed by a steep locking face.
  for(let i=0;i<24;i++)for(const [offset,radius] of [[0,64],[.78,76],[.84,64]]){
    const angle=(i+offset)*Math.PI*2/24;
    teeth+=(teeth?'L':'M')+(radius*Math.cos(angle)).toFixed(2)+','+(radius*Math.sin(angle)).toFixed(2);
  }
  const outline=document.createElementNS(svgNS,'path');outline.setAttribute('d',teeth+'Z');outline.setAttribute('class','ratchet-teeth');
  document.getElementById('ratchet-wheel').prepend(outline);
  let navigating=false,timer;
  const pageElements=[document.querySelector('header'),document.querySelector('main'),document.querySelector('footer')];
  function reset(){clearTimeout(timer);navigating=false;overlay.hidden=true;overlay.classList.remove('turning');document.body.classList.remove('is-navigating');pageElements.forEach(el=>{if(el)el.inert=false;});}
  window.addEventListener('pageshow',()=>{reset();try{applyTheme(localStorage.getItem('rx-theme')==='light'?'light':'dark');}catch{}});
  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest('a[href]');
    if(!link||link.hasAttribute('download')||link.target&&link.target!=='_self')return;
    const url=new URL(link.href,location.href),filename=url.pathname.split('/').pop()||'index.html';
    if(url.origin!==location.origin||!routes.has(filename))return;
    // Keep ordinary in-page anchors, same-page links, downloads and new tabs native.
    if(url.pathname===location.pathname||(filename===current&&url.pathname.replace(/index\.html$/,'')===location.pathname.replace(/index\.html$/,'')))return;
    event.preventDefault();if(navigating)return;navigating=true;
    document.getElementById('transition-destination').textContent='正在切换 · '+routes.get(filename);
    overlay.hidden=false;document.body.classList.add('is-navigating');pageElements.forEach(el=>{if(el)el.inert=true;});
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Exactly one revolution (24 indexed teeth), then a real document navigation.
    requestAnimationFrame(()=>overlay.classList.add('turning'));
    const finish=()=>location.assign(url.href);
    timer=setTimeout(finish,reduced?50:550);
  });
})();
