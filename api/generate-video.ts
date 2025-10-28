import { GoogleGenAI } from "@google/genai";

// FIX: Add a type declaration for the Node.js `Buffer` global.
// This resolves the TypeScript error "Cannot find name 'Buffer'" because the build environment
// for this serverless function does not seem to automatically include Node.js global types.
declare const Buffer: {
    from(data: any): any;
};

// This is a Vercel Serverless Function, not an Edge Function, to allow for longer execution times.
// It uses a Node.js-style request object (`req.body`) and response object (`res.status()...`).
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
          throw new Error("API key is not configured on the server. Please set either API_KEY or GOOGLE_CLOUD_API_KEY in your Vercel environment variables.");
        }
        const ai = new GoogleGenAI({ apiKey });

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        if (operation.error) {
            throw new Error(String(operation.error.message) || "An error occurred during video generation.");
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Could not retrieve the video download link.");
        }

        // Fetch the video file on the server to avoid exposing the key to the client.
        const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to download video file from Google (status: ${videoResponse.status})`);
        }

        // Read the response as a blob, then send it to the client as a buffer.
        const videoBlob = await videoResponse.blob();
        const videoBuffer = await videoBlob.arrayBuffer();
        
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Length', videoBuffer.byteLength);
        return res.status(200).send(Buffer.from(videoBuffer));

    } catch (error: any) {
        console.error('Error in generate-video API:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}