// Keep hydrated metadata aligned with the language pairs in prerender.mjs.
const pairs: Array<[string, string]> = [
  ['/services/custom-exhibition-stands-dubai', '/ar/exhibition-stands-dubai'],
  ['/insights/exhibition-stand-brief-checklist', '/ar/insights/exhibition-stand-brief-checklist'],
  ['/insights/custom-exhibition-stand-process-dubai', '/ar/insights/custom-exhibition-stand-process-dubai'],
  ['/insights/shell-scheme-vs-custom-vs-modular-stands', '/ar/insights/shell-scheme-vs-custom-vs-modular-stands'],
];

export function getSeoLanguage(pathname: string): { lang: string; alternates: Array<[string, string]> } {
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  const pair = pairs.find(([en, ar]) => path === en || path === ar);
  return {
    lang: path.startsWith('/ar/') ? 'ar' : 'en',
    alternates: pair ? [['en', pair[0]], ['ar', pair[1]], ['x-default', pair[0]]] : [],
  };
}
