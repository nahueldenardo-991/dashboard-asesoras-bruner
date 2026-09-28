import {coursePricing} from './reference.js?v=20260928-4';
export const STATES=['Idea','Pendiente','En producción','Para revisar','Aprobado','Publicado'];
export const PLATFORMS=['Instagram','WhatsApp','Facebook','TikTok','Anuncios pagos'];
export const FORMATS=['Reel','Carrusel','Historias','WhatsApp','Publicación'];
export const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Argentina/Buenos_Aires'}).format(new Date());
export const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function dateNumber(s){if(!s)return NaN;const p=s.includes('/')?s.split('/').reverse():s.split('-');const [y,m,d]=p.map(Number);const t=Date.UTC(y,m-1,d),x=new Date(t);return x.getUTCFullYear()===y&&x.getUTCMonth()===m-1&&x.getUTCDate()===d?t:NaN;}
export function shiftDay(s,n){return new Date(dateNumber(s)+n*86400000).toISOString().slice(0,10);}
export function previousMonth(m){const [y,n]=m.split('-').map(Number);return new Date(Date.UTC(y,n-2,1)).toISOString().slice(0,7);}
export function occupancy(c){const enrolled=Math.max(0,Number(c.enrolled)||0),available=Math.max(0,Number(c.available)||0),capacity=Math.max(Number(c.capacity)||0,enrolled+available);return {enrolled,available,capacity,percent:capacity?Math.min(100,enrolled/capacity*100):null,full:capacity>0&&available===0};}
export function priority(c,contents=[],sales=null,day=today()){
 const o=occupancy(c),days=Math.round((dateNumber(c.startDate)-dateNumber(day))/86400000),blocked=/suspend|completo/.test(norm(c.status))||o.full;
 const covered=contents.some(x=>x.courseCode===c.code&&x.kind==='content'&&!['Idea','Publicado'].includes(x.state)&&x.date>=day&&x.date<=shiftDay(day,14));
 let label='Informativo',rank=5,signal='green',action='Presentar la propuesta del curso y resolver preguntas frecuentes.';
 if(blocked){label='Completo/no promocionar';rank=6;signal='green';action='Detener las piezas comerciales. Confirmar disponibilidad antes de reutilizar.';}
 else if(!o.capacity||!Number.isFinite(days)){action='Confirmar fecha y capacidad antes de programar una promoción.';}
 else if(days<=7){label='Urgente';rank=0;signal='red';action='Campaña de cierre: reel, historias y estado de WhatsApp.';}
 else if(o.available<=Math.max(2,Math.ceil(o.capacity*.2))){label='Últimos cupos';rank=1;signal=days<=14?'amber':'green';action='Comunicar los cupos reales con historias y seguimiento por WhatsApp.';}
 else if(days<=14||norm(c.status).includes('critico')){label='Prioridad alta';rank=2;signal=days<=14?'amber':'green';action='Reel explicativo y carrusel de preguntas frecuentes esta semana.';}
 else if(o.percent<50||(!covered&&sales===0)){label='Prioridad media';rank=3;action='Mostrar la propuesta y el espacio de formación; abrir consultas.';}
 const timing=Number.isFinite(days)?days<0?`inició hace ${-days} días`:`comienza en ${days} días`:'fecha pendiente';
 return {...o,days,blocked,covered,label,rank,signal,action,reason:`${c.course} ${timing}; ${o.available} cupos disponibles${o.percent===null?'':`, ${Math.round(o.percent)}% de ocupación`}. ${covered?'Tiene contenido programado en los próximos 14 días.':'Sin contenido programado en los próximos 14 días en este dispositivo.'}${sales===null?'':` Ventas del curso en el mes: ${sales} (todas sus comisiones).`}`};
}
export function fingerprint(c){return JSON.stringify([c.startDate,c.monthlyFee,c.fullPrice,c.duration,c.status,c.available]);}
export function promotionOptions(c){
 const price=coursePricing(c);
 const money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
 const list=[{id:'none',text:'Consultar condiciones vigentes con asesoras.'}];
 if(price)list.push({id:'cash',text:`Pago completo en efectivo: ${money(price.cashTotal)}. 20% de descuento e inscripción bonificada.`},{id:'transfer',text:`Pago completo por transferencia: ${money(price.transferTotal)}. 20% de descuento y 50% de la inscripción.`},{id:'card',text:`Pago completo con tarjeta: ${money(price.cardTotal)}. Hasta 6 cuotas sin interés de ${money(price.cardTotal/6)}.`});
 if(norm(c.status).includes('critico'))list.push({id:'critical',text:'Inscripción al 50%: $ 13.000 para este curso crítico.'});
 return list;
}
export function draft(c,format,objective,promo){
 if(priority(c).blocked)return [{title:'No promocionar',text:'Curso suspendido o completo. No generar captación hasta que cambie su disponibilidad.'}];
 const facts=[c.course,c.site&&`Sede ${c.site}`,c.startDate&&`Inicio ${c.startDate}`,c.day,c.duration&&`Duración: ${c.duration}`].filter(Boolean).join(' · '),cta=`Escribinos por WhatsApp para consultar por ${c.course} y confirmar tu inscripción.`,offer=promo||'Consultar condiciones vigentes.',hook=objective==='Cerrar inscripciones'?`${c.course}: consultá por los ${occupancy(c).available} cupos disponibles.`:objective==='Resolver dudas'?`¿Tenés dudas sobre ${c.course}?`:objective==='Mostrar la institución'?`Conocé el espacio donde se cursa ${c.course}.`:objective==='Presentar el curso'?`Te presentamos ${c.course}.`:`¿Querés conocer ${c.course}?`;
 const common=[{title:'Descripción',text:`${facts}\n${offer}\n${cta}`},{title:'Llamada a la acción',text:cta}];
 if(format==='Reel')return [{title:'Gancho inicial',text:hook},{title:'Guion por escenas',text:`0–4 s: ${hook}\n4–12 s: Presentar ${c.course}. Mostrar una práctica real autorizada.\n12–22 s: ${facts}\n22–30 s: ${offer} ${cta}`},{title:'Texto en pantalla',text:`${c.course}\n${c.startDate?'Inicio '+c.startDate:'Consultar próximo inicio'}\n${c.site||'Consultar sede'}`},{title:'Tomas y duración sugeridas',text:'30 segundos. Fachada, aula y práctica real. Usar material autorizado; confirmar los contenidos de la práctica con el docente.'},...common];
 if(format==='Carrusel')return [{title:'Portada',text:hook},{title:'Placas',text:`1. ${c.course}\n2. ${facts}\n3. ¿Qué te gustaría aprender? Consultá el programa con el equipo.\n4. ${offer}\n5. ${cta}`},...common];
 if(format==='Historias')return [{title:'Secuencia de historias',text:`1. ${hook}\n2. ${facts}\n3. ${offer}\n4. ${cta}`},{title:'Encuesta o pregunta',text:'¿Querés que te enviemos información? Sí / Tengo una consulta'},...common];
 if(format==='WhatsApp')return [{title:'Estado',text:`${facts}\n${offer}\n${cta}`},{title:'Mensaje de difusión',text:`¡Hola! Te compartimos la información de ${c.course}: ${facts}. ${offer} Respondé este mensaje para consultar.`},{title:'Respuesta a consultas',text:`¡Gracias por escribirnos! ${facts}. ${offer} ¿Sobre qué aspecto del curso te gustaría saber más?`},{title:'Seguimiento para interesados',text:`¡Hola! ¿Pudiste revisar la información de ${c.course}? Podemos ayudarte con horarios, programa y formas de pago. Consultanos por disponibilidad actual.`}];
 return [{title:'Título',text:hook},{title:'Texto principal',text:`${facts}\n${offer}\n${cta}`},{title:'Enfoque / beneficios a validar',text:`Objetivo editorial: ${objective}. Completar beneficios con el programa confirmado; no prometer empleabilidad ni certificaciones sin verificar.`},{title:'Hashtags sugeridos',text:'#InstitutoBruner #Formación '+ '#'+c.course.replace(/[^\p{L}\p{N}]/gu,'')},...common];
}
