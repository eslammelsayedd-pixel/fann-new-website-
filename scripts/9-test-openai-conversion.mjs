import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync('public/openai-conversion.js', 'utf8');
const receipt = { persisted: true, submissionId: 'd149d322-cfb2-4c63-a781-6ce28014a352' };
function run(enabled) {
  const scripts = [], window = {crypto:{randomUUID:()=>receipt.submissionId}}, handlers = {};
  vm.runInNewContext(enabled ? source.replace('var ENABLED = false;', 'var ENABLED = true;') : source,
    {window, document: {addEventListener:(n,cb)=>handlers[n]=cb, createElement: () => ({}), head: {appendChild: s => scripts.push(s)}}, Set, URL});
  return {window, scripts, handlers, hook: window.fannOpenAIConversion};
}
const off = run(false);
off.hook.setConsent(true);
assert.equal(off.scripts.length, 0);
assert.equal(off.window.oaiq, undefined);
assert.equal(off.hook.measurePersistedLead(receipt), false);
const on = run(true);
assert.equal(on.scripts.length, 0);
assert.equal(on.hook.measurePersistedLead(receipt), false);
on.hook.setConsent(false);
assert.equal(on.scripts.length, 0);
on.hook.setConsent(true);
assert.equal(on.scripts.length, 1);
const calls = () => on.window.oaiq.q.map(x => Array.from(x));
assert.deepEqual(JSON.parse(JSON.stringify(calls())).slice(0,3), [
  ['consent',false], ['init',{pixelId:'5TNUVWtpTdznDLy9GfKLwk',debug:true}], ['consent',true]
]);
for (const invalid of [{success:true}, {persisted:false,...{submissionId:receipt.submissionId}}, {persisted:true,submissionId:'buyer@example.com'}]) assert.equal(on.hook.measurePersistedLead(invalid), false);
assert.equal(on.hook.measurePersistedLead(receipt), true);
assert.equal(on.hook.measurePersistedLead(receipt), false);
assert.deepEqual(JSON.parse(JSON.stringify(calls().at(-1))), ['measure','lead_created',{type:'customer_action'},{event_id:receipt.submissionId,opt_out:true}]);
on.hook.setConsent(false);
assert.equal(on.hook.measurePersistedLead({...receipt, submissionId:'43a468df-a532-4b86-b031-e5ac0c906ce0'}), false);
assert.deepEqual(calls().at(-1), ['consent',false]);
console.log('PASS: disabled/no SDK; consent ordering; receipt validation; dedupe; opt_out; revocation; no PII');

const clicks = run(true); clicks.hook.setConsent(true);
const click = {isTrusted:true,defaultPrevented:false,target:{closest:()=>({href:'https://wa.me/971505667502'})}};
clicks.handlers.click({...click,isTrusted:false}); assert.equal(clicks.window.oaiq.q.length,3);
clicks.handlers.click(click); assert.equal(clicks.window.oaiq.q.at(-1)[3].custom_event_name,'whatsapp_click');
assert.equal(clicks.window.oaiq.q.at(-1)[3].opt_out,true);
clicks.hook.setConsent(false); const count=clicks.window.oaiq.q.length; clicks.handlers.click(click);assert.equal(clicks.window.oaiq.q.length,count);
console.log('PASS: intentional WhatsApp click only; custom not lead; consent gate');
