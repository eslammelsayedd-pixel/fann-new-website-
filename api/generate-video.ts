import { GoogleGenAI } from "@google/genai";

// This is a Vercel Serverless Function, not an Edge Function, to allow for longer execution times.
// Configure maxDuration in vercel.json for this function.
export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: {'Content-Type': 'application/json'} });
    }

    try {
        const { prompt } = await req.json();
        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt is required.' }), { status: 400, headers: {'Content-Type': 'application/json'} });
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
            // FIX: The operation error message can be of type `unknown`. Coercing to a string
            // ensures it can be safely passed to the Error constructor.
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

        // Return the video blob directly to the client.
        const videoBlob = await videoResponse.blob();
        
        return new Response(videoBlob, {
            status: 200,
            headers: { 'Content-Type': 'video/mp4' }
        });

    } catch (error: any) {
        console.error('Error in generate-video API:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: {'Content-Type': 'application/json'} });
    }
}