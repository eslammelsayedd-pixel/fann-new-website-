import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { submitLead } from '../lib/submitLead';

// Existing gtag loader is in index.html. This route adds only the Ads destination.
const ADS_CONVERSION_LABEL = 'AW-17220461597/VUwgCIrGhoYdEJ3IrZNA';

function gtag_report_conversion(url?: string) {
  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return false;
  const callback = () => { if (url) window.location.assign(url); };
  gtag('event', 'conversion', {
    send_to: ADS_CONVERSION_LABEL,
    value: 1.0,
    currency: 'AED',
    event_callback: callback,
  });
  return false;
}

const whatsappUrl = 'https://wa.me/971505667502?text=Hi+FANN%2C+I%27d+like+a+3D+stand+concept+and+full+quote+for+my+upcoming+exhibition.+My+show%2C+stand+size+and+open+sides+are%3A';
const photos = [
  { src: '/images/stands/1-trevos-light-middle-east.webp', alt: 'TREVOS exhibition stand at Light Middle East, Dubai (2023), built by FANN', title: 'TREVOS - Light Middle East 2023', link: '/portfolio/trevos-light-middle-east' },
  { src: '/images/stands/2-bayara-gulfood.webp', alt: 'Bayara exhibition stand at Gulfood, Dubai (2020), built by FANN', title: 'Bayara - Gulfood 2020', link: '/portfolio/bayara-gulfood' },
  { src: '/images/stands/6-geven-aircraft-interiors.webp', alt: 'Geven exhibition stand at Aircraft Interiors Middle East, Dubai (2025), built by FANN', title: 'Geven - Aircraft Interiors Middle East 2025', link: '/portfolio/geven-aircraft-interiors' },
];

const openSideOptions = [
  { value: '1 side open (in-line)', closed: ['top', 'left', 'right'] },
  { value: 'Corner (front + right open)', closed: ['top', 'left'] },
  { value: 'Corner (front + left open)', closed: ['top', 'right'] },
  { value: '3 sides open (peninsula)', closed: ['top'] },
  { value: '4 sides open (island)', closed: [] },
];
function StandDiagram({ closed }: { closed: string[] }) {
  const edges = { top: [8,8,40,8], right: [40,8,40,40], bottom: [8,40,40,40], left: [8,8,8,40] };
  return <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" aria-hidden="true"><rect x="8" y="8" width="32" height="32" fill="#171717" />{Object.entries(edges).map(([side, points]) => <line key={side} x1={points[0]} y1={points[1]} x2={points[2]} y2={points[3]} stroke={closed.includes(side) ? '#f5f2eb' : '#c9a962'} strokeWidth={closed.includes(side) ? 4 : 2} strokeDasharray={closed.includes(side) ? undefined : '3 3'} />)}</svg>;
}

const fieldClass = 'mt-1 w-full rounded-sm border border-white/20 bg-[#171717] px-2 py-2.5 text-sm text-[#f5f2eb] md:px-3 md:py-3 placeholder:text-white/40 focus:border-[#c9a962] focus:outline-none';

export default function ExhibitionAdsLandingPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', showName: '', standSize: '', openSides: '' });
  const [floorPlan, setFloorPlan] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (busy || sent) return;
    if (!form.phone.trim() && !form.email.trim()) { setError('Add a phone number or email so we can reply.'); return; }
    setBusy(true); setError('');
    try {
      let floorPlanUrl = '';
      if (floorPlan) {
        const ext = floorPlan.name.split('.').pop()?.toLowerCase() || '';
        const types: Record<string, string> = { pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
        const request = async (body: unknown) => {
          const r = await fetch('/api/floor-plan-upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          const d = await r.json();
          if (!r.ok || !d.success) throw new Error(d.error || 'Floor plan upload failed. Your request has not been sent.');
          return d;
        };
        const start = await request({ action: 'start', name: floorPlan.name, size: floorPlan.size, type: types[ext] });
        const multipart = new FormData(); multipart.append('cacheControl', '0'); multipart.append('', new Blob([floorPlan], { type: types[ext] }), floorPlan.name);
        const upload = await fetch(start.uploadUrl, { method: 'PUT', body: multipart });
        if (!upload.ok) throw new Error('Floor plan upload failed. Your request has not been sent. Please retry.');
        const finish = await request({ action: 'finish', path: start.path });
        floorPlanUrl = finish.downloadUrl;
      }
      await submitLead({
        formType: 'Google Ads exhibition landing - 24h concept and quote',
        name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
        details: {
          source: 'Google Ads exhibition landing',
          floorPlan: floorPlanUrl, floorPlanFilename: floorPlan?.name || '', floorPlanLinkExpires: floorPlanUrl ? '30 days' : '',
          offer: '3D stand concept + full quote within 24 hours',
          showName: form.showName.trim(), standSize: form.standSize.trim(), openSides: form.openSides,
          campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
        },
      });
      gtag_report_conversion(); // Only after submitLead confirms delivery.
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Your request could not be sent. Please call or WhatsApp us.');
    } finally { setBusy(false); }
  }
  const fields: { key: keyof typeof form; label: string; type?: string; hint?: string }[] = [
    { key: 'name', label: 'Name', hint: 'Your name' },
    { key: 'phone', label: 'Phone (or add email)', type: 'tel', hint: '+971...' },
    { key: 'email', label: 'Email (or add phone)', type: 'email', hint: 'you@company.com' },
    { key: 'showName', label: 'Show name', hint: 'e.g. GITEX' },
    { key: 'standSize', label: 'Stand size', hint: 'e.g. 6 x 3 m or 18 sqm' },
  ];
  return <>
    <SEO title="3D Exhibition Stand Concept + Quote in 24 Hours" description="FANN designs and builds custom exhibition stands. Send your show brief for a 3D stand concept and full quote within 24 hours." />
    <div className="ads-landing-page">
    <section className="bg-[#111111] px-5 pb-10 pt-28 text-[#f5f2eb] md:pb-14 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[1fr_440px] lg:gap-12">
        <div className="lg:pt-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.22em] text-[#c9a962]">Custom exhibition stands</p>
          <h1 className="max-w-2xl font-serif text-4xl font-bold leading-[1.12] md:text-5xl lg:text-[3.5rem]">3D Stand Concept + Full Quote in 24 Hours</h1>
          <p className="mt-4 max-w-xl text-base md:mt-6 md:text-lg leading-relaxed text-[#d4d1cb]">Tell us your name, how to reach you, show and stand size. Our team will discuss your brief and put together a concept and complete quote.</p>
          <p className="mt-4 text-sm text-[#e1c78d]">Scope and price agreed before production. Any requested changes are confirmed before work proceeds.</p>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-8 md:gap-3">
            <a href="tel:+971505667502" data-track="ads-call" className="rounded-sm border border-[#c9a962] px-3 py-2 text-sm font-semibold md:px-5 md:py-3 md:text-base text-[#e1c78d] hover:bg-[#c9a962] hover:text-black">Call +971 50 566 7502</a>
            <a href={whatsappUrl} data-track="ads-whatsapp" target="_blank" rel="noopener noreferrer" className="rounded-sm bg-[#25d366] px-5 py-3 text-base font-bold text-[#071b0e] hover:bg-[#50e080]">WhatsApp your brief - skip the form</a>
          </div>
        </div>
        <div id="brief" className="scroll-mt-28 rounded-sm border border-[#c9a962]/40 bg-[#222] p-4 shadow-2xl md:p-7">
          {sent ? <div role="status" className="py-10 text-center"><h2 className="font-serif text-3xl text-[#e1c78d]">Request received</h2><p className="mt-4 text-[#d4d1cb]">Thank you. FANN will contact you about your show brief.</p></div> : <>
            <h2 className="font-serif text-2xl text-[#f5f2eb]">Get your concept and quote</h2>
            <p className="mt-2 text-sm text-[#d4d1cb]">Start with your name, phone or email, show and stand size. Open sides and a floor plan are optional.</p>
            <form onSubmit={send} className="mt-4 grid grid-cols-2 gap-2 md:mt-5 md:gap-3">
              {fields.map(({key,label,type='text',hint}) => <label key={key} className="text-xs font-medium text-[#e4dfd7] md:text-sm">{label}{['name', 'showName', 'standSize'].includes(key) ? ' *' : ''}<input className={fieldClass} name={key} type={type} placeholder={hint} autoComplete={key === 'name' ? 'name' : key === 'phone' ? 'tel' : key === 'email' ? 'email' : undefined} required={['name', 'showName', 'standSize'].includes(key)} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /></label>)}
              <label className="text-xs font-medium text-[#e4dfd7] md:text-sm">Open sides (optional)<select name="openSides" className={fieldClass} value={form.openSides} onChange={e => setForm({ ...form, openSides: e.target.value })}><option value="">Select</option>{openSideOptions.map(option => <option key={option.value} value={option.value}>{option.value}</option>)}</select></label>
              <div className="col-span-2"><div className="grid grid-cols-2 gap-2">{openSideOptions.map(option => <div key={option.value} className={`flex items-center gap-2 rounded border p-2 text-xs ${form.openSides === option.value ? 'border-[#c9a962] bg-[#171717]' : 'border-white/15'}`}><StandDiagram closed={option.closed}/><span>{option.value}</span></div>)}</div><p className="mt-2 text-xs text-[#aaa49b]">Not sure? Leave open sides blank. Solid white = closed wall. Dashed gold = open side. Front = bottom edge of each diagram.</p></div>
              <label className="col-span-2 text-xs font-medium text-[#e4dfd7] md:text-sm">Floor plan (optional)<input className={fieldClass} name="floorPlan" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.gif" onChange={e => { const file = e.target.files?.[0] || null; if (file && (file.size > 5 * 1024 * 1024 || !/\.(pdf|jpe?g|png|webp|gif)$/i.test(file.name))) { setFloorPlan(null); e.target.value = ''; setError('Please choose a PDF, JPG, PNG, WebP or GIF up to 5 MB.'); return; } setError(''); setFloorPlan(file); }} /><span className="mt-1 block text-xs text-[#aaa49b]">PDF, JPG, PNG, WebP or GIF, up to 5 MB. Stored privately; FANN receives a download link valid for 30 days.</span></label>
              <div className="col-span-2"><button disabled={busy} type="submit" className="mt-2 w-full rounded-sm bg-[#c9a962] px-5 py-4 font-bold text-black hover:bg-[#dfc488] disabled:opacity-60">{busy ? 'Sending...' : 'Request my concept + quote'}</button>
              {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
              <p className="mt-3 text-xs leading-relaxed text-[#aaa49b]">Your details go to FANN for this request. <Link to="/privacy-policy" className="underline">Privacy policy</Link>.</p></div>
            </form>
          </>}
        </div>
      </div>
    </section>
    <section className="bg-[#1b1b1b] px-5 py-14 text-[#f5f2eb]"><div className="mx-auto max-w-6xl"><div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#c9a962]">Built by FANN</p><h2 className="mt-2 font-serif text-3xl">Selected work</h2></div><Link to="/portfolio" className="text-sm text-[#e1c78d] underline">Explore the portfolio</Link></div><div className="grid gap-5 sm:grid-cols-3">{photos.map(photo => <Link key={photo.src} to={photo.link} className="group block"><img loading="lazy" decoding="async" src={photo.src} alt={photo.alt} width="816" height="464" className="aspect-[4/3] w-full object-cover"/><span className="mt-3 block font-medium text-[#e4dfd7] group-hover:text-[#e1c78d]">{photo.title}</span></Link>)}</div><p className="mt-6 text-xs text-[#aaa49b]">Project photography from FANN's portfolio. Examples of completed work, not a preview of your stand.</p></div></section>
    <section className="bg-[#111] px-5 py-14 text-[#f5f2eb]"><div className="mx-auto max-w-6xl"><h2 className="font-serif text-3xl">One team, from brief to build</h2><p className="mt-4 max-w-2xl text-[#d4d1cb]">3D concept, detailed quote, fabrication and on-site installation. We coordinate venue and authority submissions as part of the build.</p><a href="#brief" className="mt-6 inline-block rounded-sm bg-[#c9a962] px-6 py-3 font-bold text-black">Tell us about your stand</a></div></section>
    </div>
  </>;
}
