// Vercel Serverless Function (Node.js runtime)
export default function handler(req: any, res: any) {
  const routes = [
    '/',
    '/services',
    '/portfolio',
    '/fann-studio',
    '/fann-studio/exhibition',
    '/fann-studio/event',
    '/fann-studio/interior',
    '/events-calendar',
    '/about',
    '/contact',
    '/insights',
  ];
  const baseUrl = 'https://fann.ae'; // As specified in the prompt

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routes.map(route => `
        <url>
          <loc>${baseUrl}${route}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>${route === '/' ? '1.0' : '0.8'}</priority>
        </url>`).join('')}
    </urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(sitemap);
}
