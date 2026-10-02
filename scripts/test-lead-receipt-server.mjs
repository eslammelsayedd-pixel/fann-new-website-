// Isolated server handler and mocked database. No network, mail or measurement.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import crypto from 'node:crypto';
const source=fs.readFileSync('api/index.ts','utf8');
const handler=source.slice(source.indexOf('async function leadReceipt('),source.indexOf('\nasync function handleLead(')).replace("await import('node:crypto')",'mockCrypto');
const js=ts.transpileModule(handler,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText;
const validToken='5b419a73-6413-4be1-9f8c-3c1f857e492e';
const rowID='6b419a73-6413-4be1-9f8c-3c1f857e492e';
async function run({origin='https://fann.ae',method='POST',body={},db=true,rows=[{submission_id:rowID}],rate=false,key='mock',existing}={}) {
 let status,reply;const calls=[];
 const clean=(v,max=2000)=>v==null?'':String(v).replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
 const ctx={process:{env:{FANN_FLOORPLAN_STORAGE_KEY:key,FANN_OPENAI_LEAD_RECEIPTS_ENABLED:'true'}},mockCrypto:crypto,FLOORPLAN_STORAGE:'https://mock.invalid',clean,isRateLimited:()=>rate,console:{error:()=>{}},fetch:async(url,opt)=>{
 calls.push({url,opt});return {ok:db,json:async()=>calls.length===1?rows:existing};}};
 vm.createContext(ctx);vm.runInContext(js,ctx);
 const res={setHeader(){},status(s){status=s;return this;},json(j){reply=j;return j;}};
 await ctx.leadReceipt({method,headers:{origin,'x-forwarded-for':'127.0.0.1'},body:{formType:'Quote',deliveryConfirmed:true,email:'mock@example.invalid',requestToken:validToken,...body}},res);
 return {status,reply,calls};
}
let r=await run();assert.equal(r.status,200);assert.equal(r.reply.persisted,true);assert.equal(r.reply.submissionId,rowID);
const record=JSON.parse(r.calls[0].opt.body);assert.match(record.submission_id,/^[0-9a-f-]{36}$/);assert.notEqual(record.submission_id,validToken);assert.equal(record.request_hash,crypto.createHash('sha256').update(validToken).digest('hex'));
r=await run({rows:[],existing:[{submission_id:rowID}]});assert.equal(r.status,200);assert.equal(r.calls.length,2);assert.equal(r.reply.submissionId,rowID);
for(const opts of [{origin:'https://evil.invalid'},{method:'GET'},{body:{formType:''}},{body:{website:'spam'}},{body:{message:'x'.repeat(66000)}},{body:{deliveryConfirmed:false}},{body:{requestToken:'email@example.invalid'}},{body:{email:'invalid'}},{rate:true},{key:''}]){r=await run(opts);assert.ok(r.status>=400);assert.equal(r.calls.length,0);assert.equal(r.reply.persisted,false);}
r=await run({db:false});assert.equal(r.status,502);assert.equal(r.reply.persisted,false);
r=await run({rows:[]});assert.equal(r.status,502);assert.equal(r.reply.persisted,false);
console.log('PASS: origin/method/honeypot/contact/token/rate/config validation; private sanitized insert; server UUID; idempotent readback; failures suppress conversion');
