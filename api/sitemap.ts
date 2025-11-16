// Vercel Serverless Function (Node.js runtime)
export default function handler(req: any, res: any) {
  const baseUrl = 'https://fann.ae';
  const lastmod = new Date().toISOString().split('T')[0];

  const urls = [
    // Homepage
    { loc: baseUrl + '/', priority: '1.0', changefreq: 'weekly' },
    
    // Services
    { loc: baseUrl + '/services/custom-exhibition-stands-dubai', priority: '0.9', changefreq: 'monthly' },
    { loc: baseUrl + '/services/modular-exhibition-systems-dubai', priority: '0.9', changefreq: 'monthly' },
    { loc: baseUrl + '/services/turnkey-exhibition-services-uae', priority: '0.9', changefreq: 'monthly' },
    { loc: baseUrl + '/services/exhibition-stand-fabrication-dubai', priority: '0.9', changefreq: 'monthly' },
    { loc: baseUrl + '/services/interior-fitout-exhibition-spaces-dubai', priority: '0.9', changefreq: 'monthly' },

    // Events
    { loc: baseUrl + '/events/gitex-exhibition-stand-builder-dubai', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/events/gulfood-exhibition-stand-contractor-dubai', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/events/arab-health-booth-design-dubai', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/events/big-5-exhibition-stand-dubai', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/events/arabian-travel-market-exhibition-stands', priority: '0.8', changefreq: 'monthly' },

    // Portfolio
    { loc: baseUrl + '/portfolio/gitex-2024-tech-company-stand', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/gulfood-2024-luxury-food-booth', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/arab-health-2024-medical-stand', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/cityscape-2024-real-estate-pavilion', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/dubai-airshow-2023-aerospace-exhibit', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/big-5-2023-construction-stand', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/adipec-2024-energy-booth', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/wetex-2024-sustainability-stand', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/index-design-2024-interior-booth', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/beautyworld-2023-cosmetics-stand', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/intersec-2025-security-pavilion', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/aeedc-2025-dental-booth', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/dubai-motor-show-2023-automotive-stand', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/the-hotel-show-2024-hospitality-booth', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/seamless-middle-east-2024-fintech-stand', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/cabsat-2025-media-booth', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/dubai-watch-week-2023-luxury-display', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/world-blockchain-summit-2024-crypto-stand', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/gess-2025-education-pavilion', priority: '0.8', changefreq: 'monthly' },
    { loc: baseUrl + '/portfolio/middle-east-film-comic-con-2024-entertainment-booth', priority: '0.8', changefreq: 'monthly' },

    // Blog
    { loc: baseUrl + '/blog/exhibition-stand-costs-dubai-2025', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/choose-exhibition-stand-builder-checklist', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/custom-vs-modular-exhibition-stands', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/gitex-2025-planning-timeline', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/gulfood-booth-ideas-2026', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/arab-health-compliance-guide', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/exhibition-stand-design-trends-2025', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/sustainable-exhibition-stands', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/interactive-exhibition-stand-ideas', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/exhibition-stand-regulations-dubai', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/maximize-exhibition-stand-roi', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/dubai-exhibition-calendar-2025-2026', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/exhibition-stand-builders-comparison', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/dmcc-vs-ded-license-dubai', priority: '0.7', changefreq: 'weekly' },
    { loc: baseUrl + '/blog/emergency-gitex-stand-48-hours', priority: '0.7', changefreq: 'weekly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(url => `
        <url>
          <loc>${url.loc}</loc>
          <lastmod>${lastmod}</lastmod>
          <changefreq>${url.changefreq}</changefreq>
          <priority>${url.priority}</priority>
        </url>`).join('')}
    </urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(sitemap.trim());
}
