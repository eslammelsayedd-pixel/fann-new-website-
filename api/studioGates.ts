// Deterministic preflight validation and post-generation gates for FANN Studio.
// No model calls: pure functions, testable against captured real outputs.

export interface InputProblem { field: string; issue: string; question: string }

// Structured clarification BEFORE any generation. Returns [] when inputs are usable.
export function validateExhibitionInput(formData: any): InputProblem[] {
  const problems: InputProblem[] = [];
  const w = Number(formData.standWidth), l = Number(formData.standLength), h = Number(formData.standHeight);
  if (!Number.isFinite(w) || w <= 0 || w > 60) problems.push({ field: 'standWidth', issue: `invalid width "${formData.standWidth}"`, question: 'What is the stand width in metres?' });
  if (!Number.isFinite(l) || l <= 0 || l > 60) problems.push({ field: 'standLength', issue: `invalid length "${formData.standLength}"`, question: 'What is the stand length in metres?' });
  if (!Number.isFinite(h) || h <= 0) problems.push({ field: 'standHeight', issue: `missing height "${formData.standHeight}"`, question: 'What is the maximum stand height in metres allowed for your stand?' });
  else if (h > 6) problems.push({ field: 'standHeight', issue: `declared height ${h}m exceeds the GCC single-storey venue cap (6m)`, question: 'Venues cap single-storey builds at 6m. What height within 6m applies to your stand?' });
  const company = String(formData.companyName || '').trim();
  if (!company) problems.push({ field: 'companyName', issue: 'missing company name', question: 'What exact company or brand name must appear on the stand?' });
  const features = Array.isArray(formData.features) ? formData.features.filter((f: any) => typeof f === 'string' && f.trim()) : [];
  if (features.length === 0) problems.push({ field: 'features', issue: 'no required features selected', question: 'Which features must the stand include (e.g. Meeting Room, Product Display, Storage Room, Reception Desk)?' });
  const sides = formData.sides || {};
  for (const k of ['front', 'back', 'left', 'right']) {
    if (!sides[k]) problems.push({ field: `sides.${k}`, issue: `${k} side not declared`, question: `Is the ${k} side of the stand open, partially open or closed?` });
    else if (sides[k] === 'partial' && !String(formData.sidesExtent?.[k] || '').trim()) problems.push({ field: `sidesExtent.${k}`, issue: `partial ${k} side has no extent description`, question: `Describe the opening on the partially open ${k} side (which part is open, how wide).` });
  }
  return problems;
}

export interface GateResult { pass: boolean; failures: string[] }

// Deterministic checks on one generated concept's TEXT, against the declared inputs.
// Image-side brand verification needs vision/OCR and is intentionally not claimed here.
export function gateExhibitionConcept(concept: any, formData: any): GateResult {
  const cap = Number(formData.standHeight) || 4;
  const company = String(formData.companyName || '').trim().toLowerCase();
  const features: string[] = Array.isArray(formData.features) ? formData.features : [];
  const text = `${concept?.conceptName || ''}\n${concept?.style || ''}\n${concept?.description || ''}\n${concept?.keyFeature || ''}\n${(concept?.materials || []).join('\n')}`;
  const failures: string[] = [];

  // 1. Height discipline: any stated height-like measure above the declared cap fails.
  for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*m(?:etre)?s?\s*(?:high|tall|datum|clear(?:ance)?\s*height)/gi)) {
    if (parseFloat(m[1]) > cap + 0.001) failures.push(`stated height ${m[1]}m exceeds declared maximum ${cap}m`);
  }
  for (const m of text.matchAll(/(?:height of|rises to|reaches|up to)\s*(\d+(?:\.\d+)?)\s*m(?:etre)?s?\b/gi)) {
    if (parseFloat(m[1]) > cap + 0.001) failures.push(`stated height ${m[1]}m exceeds declared maximum ${cap}m`);
  }

  // 2. Area arithmetic: "A x B (C sqm)" claims must multiply out.
  for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*m?\s*[x×]\s*(\d+(?:\.\d+)?)\s*m[^\n]{0,40}?\((\d+(?:\.\d+)?)\s*(?:sqm|m²|sq\.?\s*m)\)/gi)) {
    const calc = Math.round(parseFloat(m[1]) * parseFloat(m[2]) * 10) / 10;
    if (Math.abs(calc - parseFloat(m[3])) > 0.3) failures.push(`area arithmetic wrong: ${m[1]}m x ${m[2]}m = ${calc} sqm, text claims ${m[3]} sqm`);
  }

  // 3. Required features must each be addressed by name (any significant word of the feature).
  const lower = text.toLowerCase();
  for (const f of features) {
    const words = String(f).toLowerCase().split(/\s+/).filter((w: string) => w.length >= 4);
    if (words.length > 0 && !words.some((w: string) => lower.includes(w))) failures.push(`required feature not addressed: ${f}`);
  }

  // 4. Brand presence: the declared company name must appear in the concept text.
  if (company && !text.toLowerCase().includes(company)) failures.push(`declared brand "${formData.companyName}" absent from concept text`);

  const unique = [...new Set(failures)];
  return { pass: unique.length === 0, failures: unique };
}
