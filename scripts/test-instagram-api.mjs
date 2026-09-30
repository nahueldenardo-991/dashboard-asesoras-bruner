import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';

const source=await readFile(new URL('../netlify/functions/instagram.ts',import.meta.url),'utf8');
let session=null, calls=[];
const originalFetch=globalThis.fetch, originalToken=process.env.BRUNER_INSTAGRAM_ACCESS_TOKEN;
globalThis.__instagramTestStore={get:async()=>session};
const js=stripTypeScriptTypes(source).replace("import { getStore } from '@netlify/blobs';",'const getStore=()=>globalThis.__instagramTestStore;');
const {default:handler}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const request=(token='test-session')=>new Request('https://example.test/api/instagram',{headers:token?{Authorization:'Bearer '+token}:{}});
try {
  globalThis.fetch=async(url,options)=>{
    calls.push({url:String(url),options});
    if(String(url).includes('/insights?')) return Response.json({data:[{name:'views',total_value:{value:42}},{name:'reach',total_value:{value:0}}]});
    return Response.json({username:'bruner.instituto',followers_count:100});
  };
  assert.equal((await handler(request(''))).status,401);
  assert.equal((await handler(request())).status,401);
  session={expiresAt:Date.now()-1};
  assert.equal((await handler(request())).status,401);
  assert.equal(calls.length,0,'Una sesión inválida nunca consulta Instagram');
  session={expiresAt:Date.now()+60000};
  delete process.env.BRUNER_INSTAGRAM_ACCESS_TOKEN;
  assert.equal((await handler(request())).status,503);
  process.env.BRUNER_INSTAGRAM_ACCESS_TOKEN='synthetic-server-secret';
  const response=await handler(request()), result=await response.json();
  assert.equal(response.status,200);
  assert.equal(result.metrics.views,42);
  assert.equal(result.metrics.reach,0);
  assert.equal(result.metrics.interactions,null,'Una métrica ausente no se inventa como cero');
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.ok(calls.every(c=>!c.url.includes('synthetic-server-secret')));
  assert.ok(!JSON.stringify(result).includes('synthetic-server-secret'));
  globalThis.fetch=async()=>Response.json({username:'otra.cuenta'});
  assert.equal((await handler(request())).status,502);
  globalThis.fetch=async()=>Response.json({error:{message:'synthetic-server-secret'}},{status:400});
  const failed=await handler(request());
  assert.equal(failed.status,502);
  assert.ok(!(await failed.text()).includes('synthetic-server-secret'));
  console.log('Instagram API: auth, identidad, ceros, datos ausentes y confidencialidad OK');
} finally {
  globalThis.fetch=originalFetch;
  delete globalThis.__instagramTestStore;
  if(originalToken===undefined)delete process.env.BRUNER_INSTAGRAM_ACCESS_TOKEN;
  else process.env.BRUNER_INSTAGRAM_ACCESS_TOKEN=originalToken;
}
