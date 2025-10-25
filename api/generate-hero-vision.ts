import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

const videoLibrary = [
    {
        id: 'tech',
        url: 'https://videos.pexels.com/video-files/3254013/3254013-hd_1920_1080_25fps.mp4',
        keywords: ['tech', 'futuristic', 'launch', 'digital', 'innovation', 'conference', 'gitex', 'leap', 'technology']
    },
    {
        id: 'gala',
        url: 'https://videos.pexels.com/video-files/8788448/8788448-hd_1920_1080_24fps.mp4',
        keywords: ['gala', 'luxury', 'elegant', 'awards', 'ceremony', 'art deco', 'dinner', 'celebration', 'fashion']
    },
    {
        id: 'corporate',
        url: 'https://videos.pexels.com/video-files/8538749/8538749-hd_1920_1080_25fps.mp4',
        keywords: ['corporate', 'summit', 'professional', 'business', 'meeting', 'forum', 'leadership', 'finance']
    },
    {
        id: 'interior',
        url: 'https://videos.pexels.com/video-files/8324311/8324311-hd_1920_1080_25fps.mp4',
        keywords: ['interior', 'design', 'home', 'villa', 'modern', 'architecture', 'residential', 'office', 'space']
    },
    {
        id: 'exhibition',
        url: 'https://videos.pexels.com/video-files/7578550/7578550-hd_1920_1080_30fps.mp4',
        keywords: ['exhibition', 'booth', 'stand', 'trade show', 'event', 'pavilion', 'expo', 'fair']
    },
    {
        id: 'wedding',
        url: 'https://videos.pexels.com/video-files/5669528/5669528-hd_1920_1080_25fps.mp4',
        keywords: ['wedding', 'romance', 'celebration', 'marriage', 'party', 'floral']
    },
    {
        id: 'art',
        url: 'https://videos.pexels.com/video-files/1979339/1979339-hd_1920_1080_25fps.mp4',
        keywords: ['art', 'gallery', 'creative', 'museum', 'sculpture', 'painting', 'design']
    }
];


export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { vision } = await req.json();
        if (!vision) {
            return new Response(JSON.stringify({ error: 'Vision prompt is required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Analyze the user's vision: "${vision}". Based on this, generate a response in the specified JSON format.
1.  **headline**: Create a short, inspiring headline (2-4 words) that captures the essence of the vision. Capitalize the first letter of each word.
2.  **description**: Write a compelling one-sentence description.
3.  **video_id**: Choose the single best video ID from the provided list that matches the user's vision. The available IDs are: ${videoLibrary.map(v => `'${v.id}'`).join(', ')}.

Your response MUST be a single, valid JSON object and nothing else. Do not include markdown formatting or any text outside of the JSON structure.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        description: { type: Type.STRING },
                        video_id: { type: Type.STRING, enum: videoLibrary.map(v => v.id) }
                    },
                    required: ['headline', 'description', 'video_id']
                }
            }
        });
        
        const rawText = response.text.trim();
        const result = JSON.parse(rawText);
        
        const selectedVideo = videoLibrary.find(v => v.id === result.video_id);
        if (!selectedVideo) {
            throw new Error(`Model returned an invalid video_id: ${result.video_id}`);
        }

        const finalResponse = {
            headline: result.headline,
            description: result.description,
            videoUrl: selectedVideo.url,
        };
        
        return new Response(JSON.stringify(finalResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("Error in generate-hero-vision API:", error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}