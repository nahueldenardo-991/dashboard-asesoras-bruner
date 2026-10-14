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
].map(([month,day,title,trades,scope,source])=>({month,day,title,trades,scope,source,category:scope==='Internacional'?'Días mundiales':'Oficios'}));

events.push(...[
  {
    "month": 10,
    "day": 14,
    "title": "Día Mundial de la Costurera",
    "trades": "Moldería, corte y confección · Lencería y trajes de baño",
    "category": "Días mundiales",
    "scope": "Internacional",
    "source": "https://ctaacordoba.org/conmemoran-el-dia-del-costurero-con-una-jornada-de-visibilizacion-de-sus-derechos/"
  },
  {
    "month": 1,
    "day": 1,
    "title": "Año Nuevo",
    "trades": "Saludos y planificación anual",
    "category": "Celebraciones",
    "scope": "Celebración popular",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 1,
    "day": 6,
    "title": "Día de Reyes",
    "trades": "Regalos · Artesanías · Confección",
    "category": "Celebraciones",
    "scope": "Celebración popular",
    "source": "https://es.wikipedia.org/wiki/Epifan%C3%ADa"
  },
  {
    "month": 2,
    "day": 14,
    "title": "Día de los Enamorados",
    "trades": "Regalos · Confección · Artesanías",
    "category": "Celebraciones",
    "scope": "Celebración popular",
    "source": "https://es.wikipedia.org/wiki/D%C3%ADa_de_San_Valent%C3%ADn"
  },
  {
    "month": 3,
    "day": 24,
    "title": "Día Nacional de la Memoria por la Verdad y la Justicia",
    "trades": "Conmemoración institucional",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 4,
    "day": 2,
    "title": "Día del Veterano y de los Caídos en la Guerra de Malvinas",
    "trades": "Conmemoración institucional",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 5,
    "day": 18,
    "title": "Día de la Escarapela",
    "trades": "Identidad nacional · Confección",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/pais/simbolos/escarapela"
  },
  {
    "month": 5,
    "day": 25,
    "title": "Día de la Revolución de Mayo",
    "trades": "Identidad nacional · Comunidad",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 6,
    "day": 17,
    "title": "Paso a la Inmortalidad de Martín Miguel de Güemes",
    "trades": "Conmemoración institucional",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 6,
    "day": 20,
    "title": "Día de la Bandera · Manuel Belgrano",
    "trades": "Identidad nacional · Confección",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 7,
    "day": 9,
    "title": "Día de la Independencia",
    "trades": "Identidad nacional · Comunidad",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 8,
    "day": 17,
    "title": "Paso a la Inmortalidad del General José de San Martín",
    "trades": "Conmemoración institucional",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 10,
    "day": 12,
    "title": "Día del Respeto a la Diversidad Cultural",
    "trades": "Comunidad · Saberes y oficios",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 10,
    "day": 31,
    "title": "Halloween",
    "trades": "Confección de disfraces · Decoración",
    "category": "Celebraciones",
    "scope": "Celebración popular",
    "source": "https://es.wikipedia.org/wiki/Halloween"
  },
  {
    "month": 11,
    "day": 10,
    "title": "Día de la Tradición",
    "trades": "Artesanías · Confección · Oficios tradicionales",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/noticias/10-de-noviembre-dia-de-la-tradicion-2"
  },
  {
    "month": 11,
    "day": 20,
    "title": "Día de la Soberanía Nacional",
    "trades": "Conmemoración institucional",
    "category": "Fechas patrias",
    "scope": "Argentina",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 12,
    "day": 8,
    "title": "Inmaculada Concepción",
    "trades": "Celebración religiosa · Decoración",
    "category": "Celebraciones",
    "scope": "Celebración popular",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 12,
    "day": 24,
    "title": "Nochebuena",
    "trades": "Decoración · Regalos · Confección",
    "category": "Celebraciones",
    "scope": "Celebración popular",
    "source": "https://es.wikipedia.org/wiki/Nochebuena"
  },
  {
    "month": 12,
    "day": 25,
    "title": "Navidad",
    "trades": "Decoración · Regalos · Confección",
    "category": "Celebraciones",
    "scope": "Celebración popular",
    "source": "https://www.argentina.gob.ar/feriados"
  },
  {
    "month": 12,
    "day": 31,
    "title": "Fin de año",
    "trades": "Balance anual · Comunidad",
    "category": "Celebraciones",
    "scope": "Celebración popular",
    "source": "https://es.wikipedia.org/wiki/Nochevieja"
  },
  {
    "month": 3,
    "day": 22,
    "title": "Día Mundial del Agua",
    "trades": "Plomería · Instalaciones sanitarias",
    "category": "Días mundiales",
    "scope": "Internacional",
    "source": "https://www.unesco.org/es/days/world-water?hub=370"
  },
  {
    "month": 4,
    "day": 21,
    "title": "Día Mundial de la Creatividad y la Innovación",
    "trades": "Diseño · Confección · Armado de muebles",
    "category": "Días mundiales",
    "scope": "Internacional",
    "source": "https://www.un.org/es/events/creativityday/index.shtml"
  },
  {
    "month": 4,
    "day": 28,
    "title": "Día Mundial de la Seguridad y la Salud en el Trabajo",
    "trades": "Seguridad en todos los oficios",
    "category": "Días mundiales",
    "scope": "Internacional",
    "source": "https://www.un.org/observances/work-safety-day"
  },
  {
    "month": 6,
    "day": 5,
    "title": "Día Mundial del Medio Ambiente",
    "trades": "Reutilización de materiales · Refrigeración · Electricidad",
    "category": "Días mundiales",
    "scope": "Internacional",
    "source": "https://www.un.org/es/observances/environment"
  }
]);

export const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
export function argentinaDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const p = Object.fromEntries(parts.map(x=>[x.type,x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}
const stamp = (year,e)=>`${year}-${String(e.month).padStart(2,'0')}-${String(e.day).padStart(2,'0')}`;

export function eventsForYear(year) {
  const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451);
  const em=Math.floor((h+l-7*m+114)/31),ed=(h+l-7*m+114)%31+1;
  const easter=Date.UTC(year,em-1,ed);
  const movable=[[-48,'Carnaval · lunes'],[-47,'Carnaval · martes'],[-3,'Jueves Santo'],[-2,'Viernes Santo'],[0,'Domingo de Pascua']].map(([offset,title])=>{
    const date=new Date(easter+offset*86400000);return {month:date.getUTCMonth()+1,day:date.getUTCDate(),title,trades:'Celebración · Comunidad · Artesanías',category:'Celebraciones',scope:'Fecha móvil',source:'https://www.argentina.gob.ar/feriados'};
  });
  for(const [month,title,source] of [[6,'Día del Padre','https://es.wikipedia.org/wiki/D%C3%ADa_del_Padre'],[10,'Día de la Madre','https://es.wikipedia.org/wiki/D%C3%ADa_de_la_Madre']]){
    const day=1+(7-new Date(Date.UTC(year,month-1,1)).getUTCDay())%7+14;
    movable.push({month,day,title,trades:'Regalos · Confección · Artesanías',category:'Celebraciones',scope:'Argentina · tercer domingo',source});
  }
  return [...events,...movable].sort((a,b)=>a.month-b.month||a.day-b.day||a.title.localeCompare(b.title));
}

export function upcoming(day = argentinaDay(), limit = 6) {
  const year = Number(day.slice(0,4));
  return [year,year+1].flatMap(y=>eventsForYear(y).map(e=>({...e,date:stamp(y,e)}))).filter(e=>e.date>=day)
    .sort((a,b)=>a.date.localeCompare(b.date)).slice(0,limit);
}

export function todayEvents(day = argentinaDay()) {
  const list=eventsForYear(Number(day.slice(0,4))).filter(e=>stamp(Number(day.slice(0,4)),e)===day);
  if(day==='2026-10-14') list.push({title:'Día de las Manos Creativas',demo:true});
  return list;
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
    const category=$('efCategory').value;
    const list=eventsForYear(year).filter(e=>e.month===selected&&(!category||e.category===category));
    $('efHeading').textContent=`${months[selected-1]} ${year}`;
    $('efCount').textContent=`${list.length} efemérides en este mes`;
    const offset=(new Date(Date.UTC(year,selected-1,1)).getUTCDay()+6)%7;
    const days=new Date(Date.UTC(year,selected,0)).getUTCDate();
    $('efGrid').innerHTML=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d=>`<span class="ef-weekday">${d}</span>`).join('')+
      Array.from({length:offset},()=>'<div class="ef-blank" aria-hidden="true"></div>').join('')+
      Array.from({length:days},(_,i)=>{
        const n=i+1, matches=list.filter(e=>e.day===n), date=stamp(year,{month:selected,day:n});
        return `<div class="ef-day ${matches.length?'ef-marked':''} ${date===today?'ef-today':''}"><time datetime="${date}">${n}</time>${matches.map(e=>`<a href="#ef-date-${e.month}-${e.day}-${encodeURIComponent(e.title)}">${e.title}</a>`).join('')}</div>`;
      }).join('');
    $('efList').innerHTML=list.map(e=>`<article class="panel ef-card" id="ef-date-${e.month}-${e.day}-${encodeURIComponent(e.title)}"><div class="ef-date"><strong>${e.day}</strong><span>${months[e.month-1]}</span></div><div><span class="badge">${e.category} · ${e.scope}</span><h3>${e.title}</h3><p>${e.trades}</p><a href="${e.source}" target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div></article>`).join('')||'<p class="empty">No hay efemérides cargadas para este mes. Elegí otro mes para explorar las fechas.</p>';
  }
  function renderToday() {
    const list=todayEvents(today), container=$('efTodayItems');
    container.replaceChildren();
    if(!list.length){container.textContent='Hoy no hay efemérides en el calendario.';return;}
    list.forEach(e=>{
      const row=document.createElement('label'); row.className='ef-today-check';
      const check=document.createElement('input');check.type='checkbox';
      const title=document.createElement('span'); title.textContent=e.title+(e.demo?' · PRUEBA FICTICIA, solo hoy':'');
      const status=document.createElement('strong');status.setAttribute('role','status');
      const key='bruner.marketing.efemeride.done:'+today+':'+e.title;
      const paint=()=>{status.textContent=check.checked?'✓ Realizada':'Pendiente';row.classList.toggle('ef-done',check.checked);};
      try{check.checked=localStorage.getItem(key)==='1';}catch{$('efTodayNotice').textContent='No se puede acceder al guardado local en este navegador.';}
      paint();
      check.addEventListener('change',()=>{
        try{if(check.checked)localStorage.setItem(key,'1');else localStorage.removeItem(key);$('efTodayNotice').textContent='Estado guardado en este navegador. Podés destildar para deshacer.';}
        catch{check.checked=!check.checked;$('efTodayNotice').textContent='No se pudo guardar el cambio. Intentá nuevamente.';}
        paint();
      });
      row.append(check,title,status);container.append(row);
    });
  }
  function ticker() {
    const next=upcoming(today);
    const content=next.map(e=>`<span class="ef-ticker-item"><strong>${e.date===today?'HOY':`${e.day} ${months[e.month-1].slice(0,3).toUpperCase()} ${e.date.slice(0,4)}`}</strong> ${e.title}<span aria-hidden="true">✦</span></span>`).join('');
    $('efTrack').innerHTML=`<div class="ef-ticker-group">${content}</div><div class="ef-ticker-group" aria-hidden="true">${content}</div>`;
  }
  $('efCategory').addEventListener('change',render); $('efMonth').addEventListener('change',render); $('efYear').addEventListener('change',render);
  $('efCurrent').onclick=()=>{$('efMonth').value=Number(today.slice(5,7));$('efYear').value=Number(today.slice(0,4));render();};
  $('efOpen').onclick=open;
  $('efPause').onclick=()=>{
    const paused=$('efBanner').classList.toggle('ef-paused');
    $('efPause').setAttribute('aria-pressed',String(paused));
    $('efPause').textContent=paused?'Reanudar':'Pausar';
  };
  function updateDay(){const day=argentinaDay();if(day!==today){today=day;ticker();render();renderToday();}}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateDay();});
  setInterval(updateDay,60000);
  ticker();render();renderToday();
}
