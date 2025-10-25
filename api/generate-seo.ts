import { GoogleGenAI, Type } from "@google/genai";

// This is a Vercel Serverless Function (Node.js runtime).
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { topic } = req.body;
        if (!topic) {
             return res.status(400).json({ error: 'Topic is required.' });
        }
        
        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
          throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are an expert SEO and LLMO (Large Language Model Optimization) specialist working for FANN.

**About FANN:**
FANN is a premier company in Dubai, UAE, specializing in:
1. Exhibition Stand Design & Build (for events like GITEX, Arab Health).
2. Corporate Event Management (product launches, galas).
3. Luxury Interior Design (commercial and residential).
Our brand is about innovation, luxury, and flawless execution.

**Your Task:**
Based on the user-provided topic, generate a complete set of SEO and LLMO optimizations.

**Topic:** "${topic}"

**Instructions & Constraints:**
1.  **SEO Title:** Create a compelling, keyword-rich title. MUST be under 60 characters.
2.  **Meta Description:** Write an engaging summary that encourages clicks. MUST be under 160 characters.
3.  **JSON-LD Schema:** Generate relevant and valid JSON-LD structured data. Choose the most appropriate schema type (e.g., 'FAQPage', 'Service', 'Article'). The output for this key MUST be a string containing a valid, pretty-printed JSON object.
4.  **LLMO Summary:** Write a clear, factual, and concise summary for an 'llms.txt' file. This should explain the topic from FANN's perspective, helping AI models understand and accurately represent our expertise.

**Output Format:**
You MUST return your response as a single, valid JSON object that adheres to the provided schema. Do not include any text, explanations, or markdown formatting outside of the JSON structure.`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                seoTitle: {
                    type: Type.STRING,
                    description: "A compelling SEO title under 60 characters."
                },
                metaDescription: {
                    type: Type.STRING,
                    description: "An engaging meta description under 160 characters."
                },
                jsonLdSchema: {
                    type: Type.STRING,
                    description: "A string containing a valid, pretty-printed JSON-LD Schema.org object."
                },
                llmoSummary: {
                    type: Type.STRING,
                    description: "A concise summary for LLMs, formatted as plain text."
                }
            },
            required: ['seoTitle', 'metaDescription', 'jsonLdSchema', 'llmoSummary']
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                responseSchema: responseSchema
            },
        });

        const rawText = response.text.trim();
        const result = JSON.parse(rawText);

        // Pretty-print the JSON-LD schema string if it's not already
        try {
            const schemaObject = JSON.parse(result.jsonLdSchema);
            result.jsonLdSchema = JSON.stringify(schemaObject, null, 2);
        } catch (e) {
            // If it's not valid JSON, leave it as is for the user to see the error
            console.warn("Could not parse and pretty-print the generated JSON-LD schema.");
        }

        return res.status(200).json(result);

    } catch (error: any) {
        console.error('Error in generate-seo API:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
