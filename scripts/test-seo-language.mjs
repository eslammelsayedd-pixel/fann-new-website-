import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
const source = readFileSync(new URL('../utils/seoLanguage.ts', import.meta.url), 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(output, context);
const get = path => JSON.parse(JSON.stringify(context.exports.getSeoLanguage(path)));
const pairs = [
  ['/services/custom-exhibition-stands-dubai', '/ar/exhibition-stands-dubai'],
  ...['exhibition-stand-brief-checklist', 'custom-exhibition-stand-process-dubai', 'shell-scheme-vs-custom-vs-modular-stands'].map(slug => ['/insights/' + slug, '/ar/insights/' + slug]),
];
for (const [en, ar] of pairs) {
  for (const path of [en, ar, ar + '/']) {
    assert.equal(get(path).lang, path.startsWith('/ar/') ? 'ar' : 'en');
    assert.deepEqual(get(path).alternates, [['en', en], ['ar', ar], ['x-default', en]]);
  }
}
assert.deepEqual(get('/'), { lang: 'en', alternates: [] });
assert.deepEqual(get('/contact'), { lang: 'en', alternates: [] });
console.log('PASS: 4 language pairs, trailing slash and unpaired English metadata');
