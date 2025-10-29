// Vercel Serverless Function (Node.js runtime)
export default function handler(req: any, res: any) {
    const robotsTxt = `User-agent: *
Allow: /

User-agent: Google-Extended
Disallow:

User-agent: GPTBot
Disallow:

User-agent: ClaudeBot
Disallow:

User-agent: PerplexityBot
Disallow:

Sitemap: https://fann.ae/sitemap.xml`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(robotsTxt.trim());
}