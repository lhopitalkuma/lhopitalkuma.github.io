'use strict';
(() => {
  const panel=document.getElementById('writing-panel');
  if(!panel)return;
  const tabs=[...document.querySelectorAll('[data-category]')];
  const dialog=document.getElementById('reading-dialog');
  const query=new URLSearchParams(location.search);let archive=null,active=['blog','fiction'].includes(query.get('category'))?query.get('category'):'talks',opener=null;let currentBook=null;
  const labels={talks:'TALKS',blog:'BLOG',fiction:'FICTION'};
  function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node;}
  function read(entry,button){opener=button;document.getElementById('reading-title').textContent=entry.title;document.getElementById('reading-meta').textContent=entry.date+' / '+entry.label;const body=document.getElementById('reading-body');body.replaceChildren();if(entry.markdown){window.renderMarkdown(body,entry.markdown);}for(const block of entry.body||[]){body.append(el(['h2','h3'].includes(block.type)?'h3':'p','',block.text));}if(currentBook){const index=currentBook.indexOf(entry);const nav=el('nav','chapter-navigation');for(const [label,next] of [['← 上一章',index-1],['下一章 →',index+1]]){const b=el('button','',label);b.type='button';b.disabled=!currentBook[next];b.onclick=()=>{read(currentBook[next],opener);dialog.scrollTop=0;};nav.append(b);}body.append(nav);}if(!dialog.open)dialog.showModal();}
  function render(){
    if(!archive)return;
    panel.replaceChildren();panel.setAttribute('aria-labelledby','tab-'+active);
    const entries=archive[active]||[];
    if(!entries.length){const empty=el('div','writing-empty');empty.append(el('span','','A STORY YET TO BE TOLD'),el('h3','','故事还在酝酿。'),el('p','','这里留给小说、短篇和还没写完的世界。第一篇，待更新。'));panel.append(empty);}
    if(active==='fiction'){renderNovels(entries);return;}
    for(const entry of entries){
      const row=el(entry.href?'a':'button','writing-entry');
      if(entry.href){const url=new URL(entry.href,location.href);if(!['http:','https:'].includes(url.protocol))continue;row.href=url.href;row.target='_blank';row.rel='noopener noreferrer';row.setAttribute('aria-label',entry.title+'（新窗口打开）');}else{row.type='button';row.addEventListener('click',()=>{currentBook=null;read(entry,row);});}
      const date=el('time','writing-date',entry.date);date.dateTime=entry.date;
      const text=el('div','writing-entry-copy');text.append(el('h3','',entry.title),el('p','',entry.summary),el('small','',entry.label));
      row.append(date,text,el('span','writing-arrow',entry.href?'↗':'→'));panel.append(row);
    }
    panel.append(el('p','writing-count',String(entries.length).padStart(2,'0')+' ENTRIES / '+labels[active]));
  }
  function renderNovels(entries){
    const books=new Map();for(const entry of entries){const name=entry.novelTitle||'独立短篇';if(!books.has(name))books.set(name,[]);books.get(name).push(entry);}
    for(const [name,chapters] of books){chapters.sort((a,b)=>(a.chapterNumber||0)-(b.chapterNumber||0)||a.date.localeCompare(b.date));const book=el('details','novel-book');book.open=books.size===1;const summary=el('summary');summary.append(el('span','folio','FICTION / 小说'),el('h3','',name),el('small','',chapters.length+' 章 · 展开目录'));book.append(summary);const toc=el('ol','novel-toc');
      for(const chapter of chapters){const item=el('li');const button=el('button','chapter-link');button.type='button';button.append(el('small','',chapter.volume||'正文'),el('strong','',(chapter.chapterNumber?'第 '+chapter.chapterNumber+' 章 · ':'')+chapter.title),el('span','',chapter.summary||chapter.date));button.onclick=()=>{currentBook=chapters;read(chapter,button);};item.append(button);toc.append(item);}book.append(toc);panel.append(book);
    }panel.append(el('p','writing-count',books.size+' 部作品 / '+entries.length+' 章'));
  }
  function select(tab){active=tab.dataset.category;for(const t of tabs){const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;}render();}
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();tabs[next].focus();select(tabs[next]);}});});
  document.getElementById('close-reading').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  fetch('writing.json', {cache:'no-store'}).then(response=>{if(!response.ok)throw Error('Archive unavailable');return response.json();}).then(data=>{archive=data;select(tabs.find(t=>t.dataset.category===active)||tabs[0]);const entry=[...(archive.blog||[]),...(archive.fiction||[])].find(e=>e.id===query.get('entry'));if(entry){if(entry.category==='fiction')currentBook=archive.fiction.filter(e=>(e.novelTitle||'独立短篇')===(entry.novelTitle||'独立短篇')).sort((a,b)=>(a.chapterNumber||0)-(b.chapterNumber||0));read(entry,tabs.find(t=>t.dataset.category===active));}}).catch(()=>{panel.replaceChildren(el('p','writing-status','文字档案暂时未能加载，请刷新后重试。'));});
})();
