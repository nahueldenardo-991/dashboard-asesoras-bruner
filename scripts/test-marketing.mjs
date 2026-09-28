import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {dateNumber,shiftDay,previousMonth,occupancy,priority,promotionOptions,draft,fingerprint} from '../marketing/core.js';
import {coursePaymentPromotions} from '../marketing/reference.js';
import {publicationStats,enrollmentRanking} from '../marketing/activity.js';
const activity=[
 {kind:'content',state:'Publicado',date:'2026-08-28',publishedDate:'2026-09-02',platform:'Instagram',courseCode:'A'},
 {kind:'content',state:'Publicado',date:'2026-09-01',publishedDate:'2026-09-03',platform:'WhatsApp',courseCode:'A'},
 {kind:'content',state:'Publicado',date:'2026-09-01',publishedDate:'2026-08-31',platform:'Instagram',courseCode:'B'},
 {kind:'idea',state:'Publicado',publishedDate:'2026-09-04',platform:'Instagram'},
 {kind:'content',state:'Aprobado',publishedDate:'2026-09-05',platform:'Instagram'},
];
assert.deepEqual(publicationStats(activity,'2026-09'),{total:2,instagram:1,whatsapp:1,courses:1});
assert.equal(publicationStats(activity,'2026-08').total,1);
assert.equal(publicationStats([],'2026-09').total,0);
assert.deepEqual(enrollmentRanking([{label:'B',count:2,amount:999},{label:'A',count:5,amount:1}]),[{label:'A',count:5},{label:'B',count:2}]);
const day='2026-09-28',course={code:'TEST',course:'Curso de prueba',status:'En oferta',startDate:'05/10/2026',capacity:10,enrolled:4,available:6,monthlyFee:50000,duration:'4 meses',site:'Sede de prueba'};
assert.equal(dateNumber('31/02/2026'),NaN);
assert.equal(shiftDay('2026-12-31',1),'2027-01-01');
assert.equal(previousMonth('2026-01'),'2025-12');
for(const [days,label,signal] of [[7,'Urgente','red'],[8,'Prioridad alta','amber'],[14,'Prioridad alta','amber'],[15,'Prioridad media','green']]){
 const date=shiftDay(day,days).split('-').reverse().join('/');
 const p=priority({...course,startDate:date},[],0,day);assert.equal(p.label,label);assert.equal(p.signal,signal);assert.equal(p.days,days);
}
assert.equal(priority({...course,available:0,enrolled:10},[],0,day).blocked,true);
assert.equal(priority({...course,status:'Suspendido'},[],0,day).blocked,true);
assert.equal(priority({...course,startDate:'20/10/2026',enrolled:9,available:1},[],4,day).label,'Últimos cupos');
assert.deepEqual(occupancy({...course,enrolled:12,available:0}),{enrolled:12,available:0,capacity:12,percent:100,full:true});
assert.equal(priority({...course,startDate:''},[],null,day).label,'Informativo');
assert.equal(priority(course,[{kind:'content',courseCode:'TEST',date:'2026-09-29',state:'Pendiente'}],null,day).covered,true);
const options=promotionOptions(course),html=coursePaymentPromotions(course);
for(const expected of ['160.000','173.000','226.000','37.667'])assert.ok(html.includes(expected),expected);
assert.ok(options.find(x=>x.id==='cash').text.includes('160.000'));
assert.ok(options.find(x=>x.id==='transfer').text.includes('173.000'));
assert.ok(options.find(x=>x.id==='card').text.includes('226.000'));
assert.equal(promotionOptions({...course,monthlyFee:0,fullPrice:0}).length,1);
assert.ok(promotionOptions({...course,status:'Crítico'}).some(x=>x.id==='critical'));
assert.ok(!promotionOptions(course).some(x=>x.id==='critical'));
assert.notEqual(fingerprint(course),fingerprint({...course,monthlyFee:60000}));
for(const format of ['Reel','Carrusel','Historias','WhatsApp','Publicación'])assert.ok(draft(course,format,'Consultas',options[1].text).every(x=>x.title&&x.text));
assert.equal(draft({...course,status:'Completo'},'Reel','Consultas','').length,1);
for(const file of ['index.html','gestion.html']){const s=fs.readFileSync(file,'utf8');for(const match of s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);}
const app=fs.readFileSync('marketing/app.js','utf8');assert.ok(!/action:\s*['"](?:setGoal|setTeamGoal|createSale|setWorkingDays)['"]/.test(app));assert.ok(app.includes('Promise.allSettled'));
console.log('PASS: dates, semaphore boundaries, occupancy, suspended/full, coverage, exact promotion parity, missing prices, templates, legacy panel syntax and read-only API actions.');
