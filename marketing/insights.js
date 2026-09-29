import {detectCourses,instagramId} from './instagram.js?v=20260928-6';

const KEY='bruner.marketing.privateInsights.v1';
const ACCOUNT_FIELDS=['views','viewers','interactions','engagedAccounts','profileActivity','profileVisits','linkTaps','followers'];
const POST_FIELDS=['views','reach','interactions','likes','comments','shares','saves','follows'];
const AUDIENCE_FIELDS=['followerViews','nonFollowerViews','followerInteractions','nonFollowerInteractions'];
const text=(value,max=30000)=>typeof value==='string'?value.slice(0,max):'';
const number=(value,max=Number.MAX_SAFE_INTEGER)=>value===null||value===undefined?null:typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=max?value:(()=>{throw Error('La copia contiene una métrica inválida.');})();
const fields=(source,names,max)=>Object.fromEntries(names.map(key=>[key,number(source?.[key],max)]));
export function validateInsights(data){
  if(data?.version!==1||data.account!=='bruner.instituto'||!Number.isFinite(Date.parse(data.checkedAt))||!text(data.period)||!Array.isArray(data.posts)||data.posts.length>1000)throw Error('Copia de insights de Bruner inválida.');
  const ids=new Set();
  const distribution=value=>{if(!Array.isArray(value)||value.length>10)throw Error('Distribución inválida.');return value.map(r=>({label:text(r.label,80),value:number(r.value,100)}));};
  return {version:1,account:data.account,checkedAt:new Date(data.checkedAt).toISOString(),period:text(data.period,300),accountSource:text(data.accountSource,300),contentSource:text(data.contentSource,300),contentPeriod:text(data.contentPeriod,1000),
    accountMetrics:fields(data.accountMetrics,ACCOUNT_FIELDS),audience:fields(data.audience,AUDIENCE_FIELDS,100),viewDistribution:distribution(data.viewDistribution),interactionDistribution:distribution(data.interactionDistribution),
    posts:data.posts.map(p=>{const id=instagramId(p.url);if(!id||ids.has(id)||!Number.isFinite(Date.parse(p.publishedAt)))throw Error('Publicación inválida o repetida en la copia.');ids.add(id);return {url:'https://www.instagram.com/p/'+id+'/',title:text(p.title,300),text:text(p.text),format:text(p.format,80),publishedAt:new Date(p.publishedAt).toISOString(),...fields(p,POST_FIELDS)};})};
}
export function rankContent(posts,metric='views',course=''){
  const key=POST_FIELDS.includes(metric)?metric:'views';
  return posts.map(p=>({...p,courses:detectCourses(p.text)})).filter(p=>!course||(course==='unknown'?p.courses.length===0:p.courses.includes(course))).sort((a,b)=>(b[key]??-1)-(a[key]??-1)||b.publishedAt.localeCompare(a.publishedAt));
}
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=value=>value===null||value===undefined?'—':new Intl.NumberFormat('es-AR',{maximumFractionDigits:1}).format(value);
const date=value=>new Date(value).toLocaleDateString('es-AR',{timeZone:'America/Argentina/Buenos_Aires'});
const card=(label,value,note='',suffix='')=>`<article class="metric"><small>${esc(label)}</small><strong>${fmt(value)}${value==null?'':suffix}</strong><small>${esc(note)}</small></article>`;
const distribution=rows=>rows.map(r=>`<div class="bar"><span>${esc(r.label)}</span><div class="track"><i style="width:${r.value??0}%"></i></div><strong>${fmt(r.value)}%</strong></div>`).join('');
export function initInsights(){
  const root=document.getElementById('insightsDialog');let data=null;
  const el=id=>root.querySelector('#'+id);
  const showError=message=>{el('insightsError').textContent=message;};
  function render(){
    el('insightsEmpty').hidden=!!data;el('insightsData').hidden=!data;el('exportInsights').disabled=!data;if(!data)return;
    el('insightsPeriod').textContent=data.period+' · Consultado el '+date(data.checkedAt)+' · '+data.accountSource;
    const m=data.accountMetrics;
    el('accountInsights').innerHTML=card('Visualizaciones',m.views)+card('Espectadores',m.viewers)+card('Interacciones',m.interactions)+card('Cuentas con interacciones',m.engagedAccounts)+card('Visitas al perfil',m.profileVisits)+card('Toques en enlace externo',m.linkTaps)+card('Seguidores totales',m.followers,'Total de la cuenta al consultar')+card('Actividad en el perfil',m.profileActivity);
    el('audienceInsights').innerHTML=card('Visualizaciones de no seguidores',data.audience.nonFollowerViews,'','%')+card('Visualizaciones de seguidores',data.audience.followerViews,'','%')+card('Interacciones de no seguidores',data.audience.nonFollowerInteractions,'','%')+card('Interacciones de seguidores',data.audience.followerInteractions,'','%');
    el('viewDistribution').innerHTML=distribution(data.viewDistribution);el('interactionDistribution').innerHTML=distribution(data.interactionDistribution);
    el('contentInsightsPeriod').textContent=data.contentSource+' · '+data.contentPeriod;
    const courses=[...new Set(data.posts.flatMap(p=>detectCourses(p.text)))].sort(),selected=el('insightsCourse').value;
    el('insightsCourse').innerHTML='<option value="">Todos los cursos</option><option value="unknown">Sin curso identificado</option>'+courses.map(c=>`<option>${esc(c)}</option>`).join('');el('insightsCourse').value=selected;
    renderPosts();
  }
  function renderPosts(){if(!data)return;const rows=rankContent(data.posts,el('insightsSort').value,el('insightsCourse').value);
    el('insightsPostCount').textContent=rows.length+' contenidos en esta selección.';
    el('contentInsightsBody').innerHTML=rows.map((p,i)=>`<tr><td>${i+1}</td><td><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc((p.title||'Ver contenido').slice(0,120))}${p.title.length>120?'…':''}</a><br><small>${esc(p.courses.join(' · ')||'Sin curso identificado')} · ${esc(p.format)} · ${date(p.publishedAt)}</small></td>${['views','reach','interactions','likes','comments','shares','saves','follows'].map(key=>`<td>${fmt(p[key])}</td>`).join('')}</tr>`).join('')||'<tr><td colspan="10">Sin contenidos para este filtro.</td></tr>';
  }
  function importCopy(raw){const clean=validateInsights(JSON.parse(raw));localStorage.setItem(KEY,JSON.stringify(clean));data=clean;showError('');render();el('insightsImportPanel').open=false;el('insightsPaste').value='';el('insightsSaved').textContent='Copia cargada y guardada en este navegador.';}
  try{const saved=localStorage.getItem(KEY);if(saved)data=validateInsights(JSON.parse(saved));}catch{showError('No se pudo leer la copia local. Podés importar una copia válida para recuperarla.');}
  document.querySelectorAll('[data-open-insights]').forEach(button=>button.addEventListener('click',()=>root.showModal()));
  el('closeInsights').onclick=()=>root.close();el('insightsSort').onchange=renderPosts;el('insightsCourse').onchange=renderPosts;
  el('applyInsights').onclick=()=>{try{if(el('insightsPaste').value.length>2000000)throw Error('La copia supera 2 MB.');importCopy(el('insightsPaste').value);}catch(e){showError(e.message);}};
  el('insightsFile').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>2000000)throw Error('La copia supera 2 MB.');importCopy(await file.text());}catch(e){showError(e.message);}finally{e.target.value='';}};
  el('exportInsights').onclick=()=>{if(!data)return;const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='bruner-insights-'+data.checkedAt.slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  render();if(new URLSearchParams(location.search).get('insights')==='1')root.showModal();
}
