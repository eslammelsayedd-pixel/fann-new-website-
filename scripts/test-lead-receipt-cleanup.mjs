import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=fs.readFileSync('api/index.ts','utf8');
const handler=source.slice(source.indexOf('async function cleanupLeadReceipts('),source.indexOf('\nasync function leadReceipt('));
const js=ts.transpileModule(handler,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText;
async function run({secret='mock-secret',auth='Bearer mock-secret',method='GET',key='mock-key',ok=true}={}){
 const calls=[];let status,reply;const ctx={process:{env:{CRON_SECRET:secret,FANN_FLOORPLAN_STORAGE_KEY:key}},FLOORPLAN_STORAGE:'https://mock.invalid',fetch:async(url,opt)=>{calls.push({url,opt});return {ok};}};
 vm.createContext(ctx);vm.runInContext(js,ctx);const res={setHeader(){},status(s){status=s;return this;},json(d){reply=d;return d;}};
 await ctx.cleanupLeadReceipts({method,headers:{authorization:auth}},res);return {calls,status,reply};}
let r=await run();assert.equal(r.status,200);assert.equal(r.calls[0].opt.method,'DELETE');const cutoff=new Date(decodeURIComponent(r.calls[0].url.split('lt.')[1]));assert.ok(Math.abs((Date.now()-cutoff)-30*86400000)<1000);
for(const o of [{secret:''},{auth:'Bearer wrong'},{method:'POST'},{key:''}]){r=await run(o);assert.ok(r.status>=400);assert.equal(r.calls.length,0);}
r=await run({ok:false});assert.equal(r.status,502);
console.log('PASS: cleanup auth/config/method gates; only older-than30day filter; failure surfaced');
