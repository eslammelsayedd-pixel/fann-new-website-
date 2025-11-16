// Vercel Serverless Function (Node.js runtime)
export default function handler(req: any, res: any) {
    const robotsTxt = `User-agent: *
Allow: /
Allow: /services/
Allow: /events/
Allow: /portfolio/
Allow: /blog/
Disallow: /admin/
Disallow: /api/
Disallow: /thank-you/
Disallow: /*?utm_*
Disallow: /*?fbclid=*
Disallow: /*?gclid=*
Crawl-delay: 1

Sitemap: https://fann.ae/sitemap.xml`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(robotsTxt.trim());
}
