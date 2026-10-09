import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const key = 'fann-openai-measurement-consent-v1';
export default function OpenAIConsent() {
  const [choice, setChoice] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(key); } catch { /* default denied */ }
    setChoice(saved); setOpen(saved !== 'allow' && saved !== 'deny');
    (window as any).fannOpenAIConversion?.setConsent(saved === 'allow');
  }, []);
  function choose(value: 'allow' | 'deny') {
    try { localStorage.setItem(key, value); } catch { /* preference applies this visit */ }
    setChoice(value); setOpen(false);
    (window as any).fannOpenAIConversion?.setConsent(value === 'allow');
  }
  return <div className="bg-[#171717] text-white">
    <button id="fann-openai-settings" type="button" onClick={() => setOpen(true)} className="relative m-3 mb-20 md:mb-3 rounded border border-white/30 bg-[#171717] px-3 py-2 text-xs text-white" aria-label="Change ChatGPT ads measurement consent">ChatGPT measurement settings</button>
    {open && <section id="fann-openai-consent" aria-label="ChatGPT ads measurement choices" className="relative border-t border-white/20 bg-[#171717] px-5 py-4 pb-24 md:pb-6 text-white">
      <div className="mx-auto max-w-5xl"><h2 className="text-lg font-semibold">ChatGPT ads measurement</h2>
      <p className="mt-2 text-sm leading-relaxed">Allow OpenAI to measure ad visits and actions on this site? This choice applies only to ChatGPT ads measurement. Existing Google and Meta tools are not controlled by this setting. <Link to="/privacy-policy" className="underline">Privacy policy</Link>.</p>
      <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => choose('deny')} className="rounded border border-white px-5 py-2">Do not allow</button><button type="button" onClick={() => choose('allow')} className="rounded border border-white px-5 py-2">Allow</button><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 underline" aria-label="Dismiss ChatGPT measurement choices without allowing">Not now</button></div></div>
    </section>}
  </div>;
}
