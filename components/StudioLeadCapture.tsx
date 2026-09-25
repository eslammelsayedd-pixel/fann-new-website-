import React, { useState } from 'react';
import { submitLead } from '../lib/submitLead';

export default function StudioLeadCapture({ kind, brief, concept }: { kind: string; brief: Record<string, unknown>; concept?: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !phone.trim()) {
      setStatus('Please add your name, a valid email and your phone number.'); return;
    }
    setBusy(true); setStatus('');
    try {
      // Never send the generated base64 image or an uploaded logo through a lead email.
      const { logo, logoMimeType, image, ...safeBrief } = brief as any;
      await submitLead({ formType: `${kind} Studio proposal request`, name: name.trim(), email: email.trim(), phone: phone.trim(), company: String(safeBrief.companyName || ''), details: { ...safeBrief, selectedConcept: concept || '' } });
      setSent(true); setStatus('Request received. FANN will follow up with your proposal.');
    } catch (err: any) { setStatus(err?.message || 'Could not send your request. Please try again.'); }
    finally { setBusy(false); }
  }
  return <section className="mt-12 bg-fann-charcoal-light p-8 md:p-10 border border-fann-gold/30 text-white" aria-labelledby="proposal-heading">
    <h2 id="proposal-heading" className="text-3xl font-serif text-fann-gold mb-3">Get the full proposal and spec</h2>
    <p className="text-gray-300 mb-6">You've seen the concept. Share only your name, email and phone number so our team can follow up with a detailed proposal. No work email, website or logo needed.</p>
    {sent ? <p role="status" className="text-green-300">{status}</p> : <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
      <label className="text-sm">Name *<input required autoComplete="name" value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full bg-black/40 border border-white/20 p-3 text-white rounded" /></label>
      <label className="text-sm">Email *<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full bg-black/40 border border-white/20 p-3 text-white rounded" /></label>
      <label className="text-sm">Phone *<input required type="tel" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="mt-2 w-full bg-black/40 border border-white/20 p-3 text-white rounded" /></label>
      <div className="md:col-span-3"><button type="submit" disabled={busy} className="btn-gold disabled:opacity-50">{busy ? 'Sending...' : 'Request full proposal'}</button>{status && <p role="alert" className="mt-3 text-red-300">{status}</p>}</div>
    </form>}
  </section>;
}
