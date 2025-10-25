import { GoogleGenAI, Type } from "@google/genai";

// Vercel Serverless Function with increased maxDuration
export const config = {
  maxDuration: 120, // 2 minutes, as it makes multiple API calls
};

// Simplified page descriptions for the AI agent
const pages = {
    '/': 'The main homepage for FANN, showcasing all services and unique value propositions.',
    '/services': 'A detailed page describing FANN\'s three core services: Exhibition Stand Design, Corporate Event Management, and Interior Design.',
    '/portfolio': 'The project portfolio page, where users can filter and view examples of FANN\'s past work.',
    '/fann-studio': 'The landing page for the FANN Studio, our suite of AI-powered design and optimization tools.',
    '/fann-studio/exhibition': 'The AI Exhibition Stand Generator tool.',
    '/fann-studio/event': 'The AI Event Concept Generator tool.',
    '/fann-studio/interior': 'The AI Interior Design Concept tool.',
    '/fann-studio/media': 'The AI Media Studio for generating videos and editing images.',
    '/fann-studio/seo': 'The SEO & LLMO Agent dashboard page itself.',
    '/events-calendar': 'A calendar of major upcoming industry events and exhibitions in the UAE and KSA.',
    '/about': 'The "About Us" page, detailing FANN\'s mission, vision, and team.',
    '/contact': 'The contact page with address, phone, email, and a contact form.',
    '/insights': 'The FANN Intelligence Hub, an AI-powered blog for generating articles on industry trends.',
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
          throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const seoGenerationPromises = Object.entries(pages).map(async ([path, description]) => {
            const prompt = `You are an expert SEO and LLMO specialist for FANN, a Dubai-based leader in exhibitions, events, and interior design.
Generate the SEO metadata for the following page:
- **Page Path:** ${path}
- **Page Description:** ${description}

**Instructions:**
1.  **seoTitle:** Create a compelling, keyword-rich title under 60 characters.
2.  **metaDescription:** Write an engaging summary under 160 characters.
3.  **jsonLdSchema:** Generate valid JSON-LD. Choose the most appropriate schema type. The output for this key MUST be a string containing a valid JSON object.
Your response MUST be a single, valid JSON object with these three keys.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            seoTitle: { type: Type.STRING },
                            metaDescription: { type: Type.STRING },
                            jsonLdSchema: { type: Type.STRING },
                        },
                        required: ['seoTitle', 'metaDescription', 'jsonLdSchema']
                    }
                }
            });
            const result = JSON.parse(response.text.trim());
            return { [path]: result };
        });

        const results = await Promise.all(seoGenerationPromises);
        const combinedResults = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        return res.status(200).json(combinedResults);

    } catch (error: any) {
        console.error('Error in generate-site-seo API:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
