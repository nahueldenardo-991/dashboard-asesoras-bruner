// Fechas anuales: fuentes institucionales consultadas el 14/10/2026.
export const events = [
  [2,24,'Día del Trabajador Mecánico','Mecánica de motos · Inyección de motos','Argentina','https://www.copime.org.ar/news/detail/450'],
  [3,11,'Día Mundial de la Plomería','Plomería','Internacional','https://www.worldplumbing.org/WorldPlumbingDay/'],
  [3,19,'Día del Artesano y del Carpintero','Armado de muebles · Carpintería','Internacional','https://www.argentina.gob.ar/node/139202'],
  [4,22,'Día del Trabajador de la Construcción','Construcción · Plomería · Electricidad','Argentina','https://sde.gob.ar/2024/04/22/cada-22-de-abril-se-celebra-el-dia-del-trabajador-de-la-construccion/'],
  [5,1,'Día Internacional del Trabajador','Todos los oficios','Internacional','https://www.argentina.gob.ar/node/373130'],
  [6,26,'Día Mundial de la Refrigeración','Instalación de aire acondicionado · Refrigeración','Internacional','https://worldrefrigerationday.org/'],
  [7,13,'Día del Trabajador de la Energía Eléctrica','Electricidad domiciliaria','Argentina','https://fatlyf.org/13-de-julio-dia-del-trabajador-de-la-energia-electrica-y-71-aniversario-de-la-fatlyf/'],
  [7,15,'Día Mundial de las Habilidades de la Juventud','Formación en oficios','Internacional','https://www.un.org/en/events/youthskillsday/'],
  [9,7,'Día del Trabajador Metalúrgico','Soldadura · Herrería','Argentina','https://uomrosario.org.ar/efemerides.asp'],
  [10,10,'Día del Técnico','Oficios técnicos','Argentina','https://www.argentina.gob.ar/noticias/10-de-octubre-dia-del-tecnico-0'],
  [11,15,'Día de la Educación Técnica','Formación en oficios','Argentina','https://edu.misiones.gob.ar/15-de-noviembre-conmemoramos-el-dia-de-la-educacion-tecnica/'],
].map(([month,day,title,trades,scope,source])=>({month,day,title,trades,scope,source}));

export const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
export function argentinaDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const p = Object.fromEntries(parts.map(x=>[x.type,x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}
const stamp = (year,e)=>`${year}-${String(e.month).padStart(2,'0')}-${String(e.day).padStart(2,'0')}`;
export function upcoming(day = argentinaDay(), limit = 6) {
  const year = Number(day.slice(0,4));
  return events.map(e=>({...e,date:stamp(year,e)<day?stamp(year+1,e):stamp(year,e)}))
    .sort((a,b)=>a.date.localeCompare(b.date)).slice(0,limit);
}

export function initEfemerides() {
  const $ = id=>document.getElementById(id);
  let today = argentinaDay(), selected = Number(today.slice(5,7)), year = Number(today.slice(0,4));
  const open = ()=>document.querySelector('[data-tab="efemerides"]').click();
  $('efMonth').innerHTML=months.map((m,i)=>`<option value="${i+1}">${m}</option>`).join('');
  $('efMonth').value=selected;
  $('efYear').value=year;
  function render() {
    selected=Number($('efMonth').value); year=Number($('efYear').value);
    if(!Number.isInteger(year)||year<2000||year>2100) return;
    const list=events.filter(e=>e.month===selected);
    $('efHeading').textContent=`${months[selected-1]} ${year}`;
    $('efCount').textContent=`${list.length} efemérides en este mes`;
    const offset=(new Date(Date.UTC(year,selected-1,1)).getUTCDay()+6)%7;
    const days=new Date(Date.UTC(year,selected,0)).getUTCDate();
    $('efGrid').innerHTML=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d=>`<span class="ef-weekday">${d}</span>`).join('')+
      Array.from({length:offset},()=>'<div class="ef-blank" aria-hidden="true"></div>').join('')+
      Array.from({length:days},(_,i)=>{
        const n=i+1, matches=list.filter(e=>e.day===n), date=stamp(year,{month:selected,day:n});
        return `<div class="ef-day ${matches.length?'ef-marked':''} ${date===today?'ef-today':''}"><time datetime="${date}">${n}</time>${matches.map(e=>`<a href="#ef-date-${e.month}-${e.day}">${e.title}</a>`).join('')}</div>`;
      }).join('');
    $('efList').innerHTML=list.map(e=>`<article class="panel ef-card" id="ef-date-${e.month}-${e.day}"><div class="ef-date"><strong>${e.day}</strong><span>${months[e.month-1]}</span></div><div><span class="badge">${e.scope}</span><h3>${e.title}</h3><p>${e.trades}</p><a href="${e.source}" target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div></article>`).join('')||'<p class="empty">No hay efemérides cargadas para este mes. Elegí otro mes para explorar las fechas.</p>';
  }
  function ticker() {
    const next=upcoming(today);
    const content=next.map(e=>`<span class="ef-ticker-item"><strong>${e.date===today?'HOY':`${e.day} ${months[e.month-1].slice(0,3).toUpperCase()} ${e.date.slice(0,4)}`}</strong> ${e.title}<span aria-hidden="true">✦</span></span>`).join('');
    $('efTrack').innerHTML=`<div class="ef-ticker-group">${content}</div><div class="ef-ticker-group" aria-hidden="true">${content}</div>`;
  }
  $('efMonth').addEventListener('change',render); $('efYear').addEventListener('change',render);
  $('efCurrent').onclick=()=>{$('efMonth').value=Number(today.slice(5,7));$('efYear').value=Number(today.slice(0,4));render();};
  $('efOpen').onclick=open;
  $('efPause').onclick=()=>{
    const paused=$('efBanner').classList.toggle('ef-paused');
    $('efPause').setAttribute('aria-pressed',String(paused));
    $('efPause').textContent=paused?'Reanudar':'Pausar';
  };
  function updateDay(){const day=argentinaDay();if(day!==today){today=day;ticker();render();}}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateDay();});
  setInterval(updateDay,60000);
  ticker();render();
}
