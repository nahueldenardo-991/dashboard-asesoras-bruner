import {detectCourses,instagramId} from './instagram.js?v=20260930-1';

const API='https://bruner-asesoras-api.netlify.app/api/instagram';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0?new Intl.NumberFormat('es-AR').format(n):'—';
export function initLiveInstagram(getToken){
  const dialog=document.getElementById('insightsDialog');
  const section=document.createElement('section');
  section.className='panel';
  section.innerHTML='<h3>Consulta automática a Instagram</h3><p>Últimos 30 días · consulta cada 5 minutos mientras este panel esté abierto. Las métricas reflejan la información disponible en Meta y pueden tener demora.</p><button class="primary" id="refreshLiveInstagram">Consultar ahora</button><p role="status" id="liveInstagramStatus">Ingresá con la clave de gestión para consultar Instagram.</p><div id="liveInstagramMetrics" class="metrics"></div><div id="liveInstagramPosts"></div>';
  dialog.querySelector('.section-head').after(section);
  const button=section.querySelector('button'),status=section.querySelector('[role=status]');
  let busy=false,lastAttempt=0;
  async function refresh(){
    const token=getToken();
    if(busy)return;
    if(!token){status.textContent='Cerrá esta ventana e ingresá con la clave de gestión para consultar Instagram.';return;}
    busy=true;button.disabled=true;lastAttempt=Date.now();status.textContent='Consultando Instagram…';
    try{
      const response=await fetch(API,{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:AbortSignal.timeout(45000)});
      const data=await response.json();
      if(!response.ok||!data.ok)throw Error(data.error||'No se pudo consultar Instagram.');
      if(data.account!=='bruner.instituto'||!Array.isArray(data.posts))throw Error('Respuesta de Instagram inválida.');
      section.querySelector('#liveInstagramMetrics').innerHTML=[['Visualizaciones',data.metrics.views],['Alcance de la cuenta',data.metrics.reach],['Interacciones',data.metrics.interactions],['Cuentas con interacciones',data.metrics.engagedAccounts],['Seguidores actuales',data.metrics.followers],[data.postsComplete?'Publicaciones en 30 días':'Publicaciones recuperadas (parcial)',data.posts.length]].map(([label,n])=>`<article class="metric"><small>${esc(label)}</small><strong>${fmt(n)}</strong></article>`).join('');
      section.querySelector('#liveInstagramPosts').innerHTML='<h4>Publicaciones y cursos detectados</h4>'+data.posts.filter(p=>instagramId(p.url)).map(p=>`<p><a href="https://www.instagram.com/p/${instagramId(p.url)}/" target="_blank" rel="noopener noreferrer">${esc(String(p.text||'Ver publicación').slice(0,160))}</a><br><small>${esc(detectCourses(p.text).join(' · ')||'Sin curso identificado')} · ${esc(p.format)} · Me gusta: ${fmt(p.likes)} · Comentarios: ${fmt(p.comments)}</small></p>`).join('');
      status.textContent='Consulta realizada: '+new Date(data.checkedAt).toLocaleString('es-AR')+'. '+(data.postsComplete?'Listado de publicaciones completo para los últimos 30 días.':'Listado parcial: se recuperaron las 50 publicaciones más recientes.');
    }catch(e){status.textContent='No se actualizó: '+(e.name==='TimeoutError'?'la consulta tardó demasiado.':e.message)+' Los valores anteriores, si los hay, corresponden a la última consulta exitosa.';}
    finally{busy=false;button.disabled=false;}
  }
  button.onclick=refresh;
  new MutationObserver(()=>{if(dialog.open&&Date.now()-lastAttempt>=300000)void refresh();}).observe(dialog,{attributes:true,attributeFilter:['open']});
  setInterval(()=>{if(dialog.open&&!document.hidden&&Date.now()-lastAttempt>=300000)void refresh();},15000);
  document.addEventListener('visibilitychange',()=>{if(dialog.open&&!document.hidden&&Date.now()-lastAttempt>=300000)void refresh();});
  if(dialog.open)void refresh();
}
