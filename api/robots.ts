// Vercel Serverless Function (Node.js runtime)
export default function handler(req: any, res: any) {
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://fann.ae/sitemap.xml`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(robotsTxt);
}
