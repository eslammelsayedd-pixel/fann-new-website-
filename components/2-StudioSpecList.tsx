import React from 'react';
export type StudioSpecs = { dimensions?: string[]; materials?: string[]; features?: string[]; inclusions?: string[] };
export default function StudioSpecList({ specs }: { specs?: StudioSpecs }) {
  if (!specs) return null;
  return <div className="space-y-5 border-l-2 border-fann-gold pl-5 mb-8">
    {(['dimensions', 'materials', 'features', 'inclusions'] as const).map(key =>
      Array.isArray(specs[key]) && specs[key]!.length ? <section key={key}>
        <h3 className="text-fann-gold uppercase text-xs tracking-widest font-bold mb-2">{key}</h3>
        <ul className="list-disc ml-5 space-y-2 text-sm text-gray-300">{specs[key]!.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </section> : null)}
  </div>;
}
