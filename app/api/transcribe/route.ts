import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ 
                error: "Missing API Key", 
                details: "GROQ_API_KEY is not configured in .env.local" 
            }, { status: 500 });
        }

        const { audioBase64, mimeType } = await req.json() as {
            audioBase64: string;
            mimeType: string;
        };

        if (!audioBase64) {
            return NextResponse.json({ error: "Empty audio" }, { status: 400 });
        }

        // Guard: cap payload size (~5 MB of base64)
        if (audioBase64.length > 7_000_000) {
            return NextResponse.json({ error: "Audio too large" }, { status: 413 });
        }

        // Guard: only allow safe audio MIME types
        const ALLOWED_MIME_TYPES = ["audio/webm", "audio/ogg", "audio/mp4", "audio/wav", "audio/mpeg"];
        const safeMime = ALLOWED_MIME_TYPES.includes(mimeType) ? mimeType : "audio/webm";

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // Convert base64 to buffer
        const buffer = Buffer.from(audioBase64, "base64");
        
        // Create a File-like object for Groq SDK
        // In Next.js/Node environment, we can use a Blob or a File if available, 
        // or just pass the buffer with a filename
        const file = new File([buffer], "audio.webm", { type: safeMime });

        const transcription = await groq.audio.transcriptions.create({
            file: file,
            model: "whisper-large-v3-turbo",
            response_format: "json",
        });

        return NextResponse.json({ text: transcription.text || "" });
    } catch (err: unknown) {
        const error = err as any;
        console.error("/api/transcribe error:", error.message || error.toString());
        // Do NOT expose error.message to clients
        return NextResponse.json({ 
            error: "Transcription failed"
        }, { status: 500 });
    }
}
