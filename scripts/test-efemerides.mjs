import assert from 'node:assert/strict';
import {eventsForYear,upcoming,argentinaDay} from '../marketing/efemerides.js';
const dateOf=(year,title)=>{const e=eventsForYear(year).find(e=>e.title===title);return `${e.month}-${e.day}`;};
assert.equal(upcoming('2026-10-14')[0].title,'Día Mundial de la Costurera');
assert.equal(upcoming('2026-10-14')[0].date,'2026-10-14');
assert.equal(dateOf(2026,'Día de la Madre'),'10-18');
assert.equal(dateOf(2027,'Día de la Madre'),'10-17');
assert.equal(dateOf(2026,'Día del Padre'),'6-21');
assert.equal(dateOf(2026,'Domingo de Pascua'),'4-5');
assert.equal(dateOf(2027,'Domingo de Pascua'),'3-28');
assert.equal(dateOf(2026,'Carnaval · lunes'),'2-16');
assert.equal(dateOf(2026,'Viernes Santo'),'4-3');
assert.equal(upcoming('2026-12-31')[1].date,'2027-01-01');
assert.equal(argentinaDay(new Date('2026-10-15T01:00:00Z')),'2026-10-14');
for(const year of [2026,2027,2028]){
 const list=eventsForYear(year);
 assert.equal(new Set(list.map(e=>e.title)).size,list.length);
 for(const e of list){assert.ok(e.source.startsWith('https://'));assert.ok(e.category);assert.equal(new Date(Date.UTC(year,e.month-1,e.day)).getUTCDate(),e.day);}
}
console.log(`PASS: ${eventsForYear(2026).length} fechas, costurera hoy, celebraciones móviles y cambio de año`);
