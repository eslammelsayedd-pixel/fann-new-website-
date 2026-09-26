import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { submitLead } from '../lib/submitLead';

// Existing gtag loader is in index.html. This route adds only the Ads destination.
const ADS_CONVERSION_ID = 'AW-17736248016';
const ADS_CONVERSION_LABEL = 'AW-17736248016/1mB7CN6M9oUdENDVpolC';

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

const whatsappUrl = 'https://wa.me/971505667502?text=Hi+FANN%2C+I%27d+like+a+3D+stand+concept+and+full+quote+for+my+upcoming+exhibition.+My+show%2C+stand+size+and+date+are%3A';
const photos = [
  { src: '/images/projects/national-expression-adek/01.webp', alt: 'ADEK National Expression exhibition gallery, built by FANN', title: 'National Expression, ADEK', link: '/portfolio/national-expression-adek-abu-dhabi' },
  { src: '/images/projects/icons-of-porsche/02.webp', alt: 'Icons of Porsche entrance and event display built by FANN', title: 'Icons of Porsche', link: '/portfolio/icons-of-porsche-2025-dubai' },
  { src: '/images/projects/special-olympics-ucs-2025/01.webp', alt: 'Special Olympics UAE event stage built by FANN', title: 'Special Olympics UAE', link: '/portfolio/special-olympics-uae-unified-champion-schools-2025' },
];

const fieldClass = 'mt-1 w-full rounded-sm border border-white/20 bg-[#171717] px-2 py-2.5 text-sm text-[#f5f2eb] md:px-3 md:py-3 placeholder:text-white/40 focus:border-[#c9a962] focus:outline-none';

export default function ExhibitionAdsLandingPage() {
  useEffect(() => {
    if (typeof (window as any).gtag === 'function') (window as any).gtag('config', ADS_CONVERSION_ID);
  }, []);
  const [form, setForm] = useState({ name: '', phone: '', email: '', showName: '', standSize: '', showDate: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (busy || sent) return;
    setBusy(true); setError('');
    try {
      await submitLead({
        formType: 'Google Ads exhibition landing - 24h concept and quote',
        name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
        details: {
          source: 'Google Ads exhibition landing',
          offer: '3D stand concept + full quote within 24 hours',
          showName: form.showName.trim(), standSize: form.standSize.trim(), showDate: form.showDate,
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
    { key: 'phone', label: 'Phone', type: 'tel', hint: '+971...' },
    { key: 'email', label: 'Email', type: 'email', hint: 'you@company.com' },
    { key: 'showName', label: 'Show name', hint: 'e.g. GITEX' },
    { key: 'standSize', label: 'Stand size', hint: 'e.g. 6 x 3 m or 18 sqm' },
    { key: 'showDate', label: 'Show date', type: 'date' },
  ];
  return <>
    <SEO title="3D Exhibition Stand Concept + Quote in 24 Hours" description="FANN designs and builds custom exhibition stands. Send your show brief for a 3D stand concept and full quote within 24 hours." />
    <div className="ads-landing-page">
    <section className="bg-[#111111] px-5 pb-10 pt-28 text-[#f5f2eb] md:pb-14 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[1fr_440px] lg:gap-12">
        <div className="lg:pt-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.22em] text-[#c9a962]">Custom exhibition stands</p>
          <h1 className="max-w-2xl font-serif text-4xl font-bold leading-[1.12] md:text-5xl lg:text-[3.5rem]">3D Stand Concept + Full Quote in 24 Hours</h1>
          <p className="mt-4 max-w-xl text-base md:mt-6 md:text-lg leading-relaxed text-[#d4d1cb]">Tell us your show, stand size and date. Our team will discuss your brief and put together a concept and complete quote.</p>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-8 md:gap-3">
            <a href="tel:+971505667502" data-track="ads-call" className="rounded-sm border border-[#c9a962] px-3 py-2 text-sm font-semibold md:px-5 md:py-3 md:text-base text-[#e1c78d] hover:bg-[#c9a962] hover:text-black">Call +971 50 566 7502</a>
            <a href={whatsappUrl} data-track="ads-whatsapp" target="_blank" rel="noopener noreferrer" className="rounded-sm border border-white/25 px-3 py-2 text-sm font-semibold md:px-5 md:py-3 md:text-base text-[#f5f2eb] hover:border-white">WhatsApp your brief</a>
          </div>
        </div>
        <div id="brief" className="scroll-mt-28 rounded-sm border border-[#c9a962]/40 bg-[#222] p-4 shadow-2xl md:p-7">
          {sent ? <div role="status" className="py-10 text-center"><h2 className="font-serif text-3xl text-[#e1c78d]">Request received</h2><p className="mt-4 text-[#d4d1cb]">Thank you. FANN will contact you about your show brief.</p></div> : <>
            <h2 className="font-serif text-2xl text-[#f5f2eb]">Get your concept and quote</h2>
            <p className="mt-2 text-sm text-[#d4d1cb]">Share the details below and we'll follow up about your 24-hour concept and quote.</p>
            <form onSubmit={send} className="mt-4 grid grid-cols-2 gap-2 md:mt-5 md:gap-3">
              {fields.map(({key,label,type='text',hint}) => <label key={key} className="text-xs font-medium text-[#e4dfd7] md:text-sm">{label} *<input className={fieldClass} name={key} type={type} placeholder={hint} autoComplete={key === 'name' ? 'name' : key === 'phone' ? 'tel' : key === 'email' ? 'email' : undefined} required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /></label>)}
              <div className="sm:col-span-2"><button disabled={busy} type="submit" className="mt-2 w-full rounded-sm bg-[#c9a962] px-5 py-4 font-bold text-black hover:bg-[#dfc488] disabled:opacity-60">{busy ? 'Sending...' : 'Request my concept + quote'}</button>
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
