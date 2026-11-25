import React, { useState } from 'react';
export const heardAboutOptions = ['ChatGPT', 'Gemini', 'Claude', 'Perplexity', 'Google search', 'Google Maps', 'LinkedIn', 'Instagram/Facebook', 'Exhibition or event', 'Referral / colleague', 'Email from FANN', 'Other'];
export default function HeardAboutField({ value, onChange, inputClass = 'mt-2 w-full bg-black/30 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-fann-gold' }: { value?: string; onChange?: (value: string, other: string) => void; inputClass?: string }) {
  const [source, setSource] = useState('');
  const [other, setOther] = useState('');
  const selected = value ?? source;
  return <div className="col-span-2 text-sm text-inherit"><label htmlFor="heard-about-fann">How did you first hear about FANN? <span className="opacity-70">(optional)</span></label><select id="heard-about-fann" name="heardAbout" className={inputClass} value={selected} onChange={e => { setSource(e.target.value); onChange?.(e.target.value, other); }}><option value="">Select (optional)</option>{heardAboutOptions.map(x => <option key={x} value={x}>{x}</option>)}</select>{selected === 'Other' && <label className="mt-3 block" htmlFor="heard-about-other">Please tell us (optional)<input id="heard-about-other" name="heardAboutOther" maxLength={160} className={inputClass} value={other} onChange={e => { setOther(e.target.value); onChange?.(selected, e.target.value); }}/></label>}</div>;
}
