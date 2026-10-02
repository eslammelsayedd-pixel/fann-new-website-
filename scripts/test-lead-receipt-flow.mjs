// All HTTP calls mocked. No emails, database rows or live conversions.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = fs.readFileSync('lib/submitLead.ts','utf8').replace('(import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY', '"mock-key"');
const js = ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText;
const token='5b419a73-6413-4be1-9f8c-3c1f857e492e';
const receiptID='6b419a73-6413-4be1-9f8c-3c1f857e492e';
async function run(delivery,receipt,{failReceipt=false}={}) {
 const requests=[],measured=[],ads=[]; const module={exports:{}};
 const window={location:{pathname:'/quote'},crypto:{randomUUID:()=>token},fannOpenAIConversion:{measurePersistedLead:d=>measured.push(d)},gtag:(...a)=>ads.push(a),fbq:(...a)=>ads.push(a),dataLayer:[]};
 vm.runInNewContext(js,{module,exports:module.exports,window,document:{referrer:''},AbortController,setTimeout,clearTimeout,fetch:async(url,opt)=>{
   requests.push({url,body:JSON.parse(opt.body)});
   if(requests.length===1)return {ok:delivery.success===true,json:async()=>delivery};
   if(failReceipt)throw Error('mock outage');
   return {ok:true,json:async()=>receipt};
 }});
 let error;try{await module.exports.submitLead({formType:'Quote',email:'mock@example.invalid'});}catch(e){error=e;}
 return {requests,measured,ads,error,window};
}
let r=await run({success:true},{persisted:true,submissionId:receiptID});
assert.equal(r.requests.length,2); assert.equal(r.requests[1].url,'/api/lead-receipt'); assert.equal(r.requests[1].body.requestToken,token);
assert.equal(r.measured.length,1);assert.equal(r.measured[0].submissionId,receiptID);assert.equal(r.ads.length,2);assert.equal(r.window.dataLayer.length,1);
r=await run({success:true},{persisted:false});assert.equal(r.error,undefined);assert.equal(r.measured.length,0);assert.equal(r.ads.length,2);
r=await run({success:true},{},{failReceipt:true});assert.equal(r.error,undefined);assert.equal(r.measured.length,0);assert.equal(r.ads.length,2);
r=await run({success:false},{});assert.ok(r.error);assert.equal(r.requests.length,1);assert.equal(r.measured.length,0);assert.equal(r.ads.length,0);
r=await run({},{});assert.ok(r.error);assert.equal(r.requests.length,1);
console.log('PASS: provider success before private receipt; server UUID; failure open; no duplicate email; Ads/Meta preserved; failed/unconfirmed delivery produces no conversion');
