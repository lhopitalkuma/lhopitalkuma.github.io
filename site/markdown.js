'use strict';
window.renderMarkdown=(target,source)=>{
 target.replaceChildren();let code=null,list=null;
 function inline(parent,text){const re=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;let last=0;for(const match of text.matchAll(re)){parent.append(document.createTextNode(text.slice(last,match.index)));const token=match[0];let node;if(token.startsWith('[')){const parts=/^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);node=document.createElement('a');node.textContent=parts[1];try{const u=new URL(parts[2],location.href);if(['http:','https:','mailto:'].includes(u.protocol)){node.href=u.href;node.rel='noopener noreferrer';}}catch{}}else{const n=token.startsWith('**')?2:1;node=document.createElement(token[0]==='`'?'code':n===2?'strong':'em');node.textContent=token.slice(n,-n);}parent.append(node);last=match.index+token.length;}parent.append(document.createTextNode(text.slice(last)));}
 for(const line of source.replace(/\r/g,'').split('\n')){
 if(/^\s*```/.test(line)){if(code){code=null;}else{const pre=document.createElement('pre');code=document.createElement('code');pre.append(code);target.append(pre);}list=null;continue;}
 if(code){code.append(document.createTextNode(line+'\n'));continue;}
 if(!line.trim()){list=null;continue;}
 const heading=/^(#{1,6})\s+(.+)$/.exec(line),item=/^\s*([-*+] |\d+\. )(.+)$/.exec(line);
 let node;if(item){const tag=/^\d/.test(item[1])?'ol':'ul';if(!list||list.tagName.toLowerCase()!==tag){list=document.createElement(tag);target.append(list);}node=document.createElement('li');list.append(node);inline(node,item[2]);continue;}list=null;
 if(/^\s*---+\s*$/.test(line)){target.append(document.createElement('hr'));continue;}
 node=document.createElement(heading?'h'+heading[1].length:line.startsWith('> ')?'blockquote':'p');inline(node,heading?heading[2]:line.replace(/^> /,''));target.append(node);
 }
};
