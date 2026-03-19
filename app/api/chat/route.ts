import { NextRequest, NextResponse } from "next/server";
import { retrieveContext } from "@/lib/rag/retriever";
import { ME } from "@/lib/knowledge/me";

const MODEL = "nvidia/llama-3.3-nemotron-super-49b-v1.5";
const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are Mohibullah Atif, a 21-year-old Designer & Builder.
Tone: Adaptable. Use a professional "clean & crisp" tone for technical/work queries, but a casual, friendly vibe for chit-chat.
Style: Use Perfect Sentence Case. Keep answers direct and to the point (2-3 sentences max). Avoid fluff.
Emoticons: Minimalist. Use classic emoticons like :) or :D sparingly. Graphical emojis are STRICTLY FORBIDDEN.

Rules:
1. Never break character. Speak as if you ARE Mohib.
2. If a question is about professional experience or specific work details that might be on LinkedIn, direct them there (linkedin.com/in/iamohib/).
3. If you don't know something non-professional, act curious and engage naturally.
4. Current Work: You're currently building Aura (smart notes + mindmaps), a certificate verification app, and running Shrewd (your Design Studio).
5. CRITICAL: No internal thinking blocks (<think>) or reasoning tags. Final answer only. Start your response directly with your answer.

Bio:
${ME.bio}

Interests: ${ME.interests.join(", ")}
Education: ${ME.education.semester} semester of ${ME.education.degree} at ${ME.education.school}.`;

export async function POST(req: NextRequest) {
    try {
        // Guard: reject oversized bodies (>10 KB)
        const contentLength = req.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > 10_000) {
            return NextResponse.json({ error: "Request too large" }, { status: 413 });
        }

        const { message, history = [] } = await req.json() as {
            message: string;
            history: { role: "user" | "assistant"; content: string }[];
        };

        const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

        console.log(`[REQUEST] Model: ${MODEL} | Key: ${(NVIDIA_API_KEY || "").substring(0, 8)}...`);

        if (!message?.trim()) {
            return NextResponse.json({ error: "Empty message" }, { status: 400 });
        }

        // Guard: cap history to prevent token stuffing
        const safeHistory = history.slice(-20);

        if (!NVIDIA_API_KEY || NVIDIA_API_KEY === "your_nvidia_api_key_here") {
            return NextResponse.json({ 
                error: "Missing API Key", 
                details: "NVIDIA_API_KEY is not configured or is using the placeholder in .env.local" 
            }, { status: 500 });
        }

        // ── RAG retrieval ─────────────────────────────────────────
        const context = await retrieveContext(message);

        // ── Format History for NVIDIA (OpenAI format) ─────────────
        const messages = [
            { role: "system", content: `${SYSTEM_PROMPT}\n\n<context>\n${context}\n</context>` },
            ...safeHistory.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: message }
        ];

        // ── NVIDIA NIM API Call ──────────────────────────────────
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
                temperature: 0.7,
                top_p: 1,
                max_tokens: 1024,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("[NVIDIA API ERROR]", response.status, errorData);
            throw new Error(errorData.error?.message || `NVIDIA API error: ${response.statusText}`);
        }

        const result = await response.json();
        let text = result.choices?.[0]?.message?.content || "Sorry, I had trouble responding.";

        // ── Clean Thinking Blocks ────────────────────────────────
        // Remove paired blocks: <think>...</think>
        text = text.replace(/<(think|thought)>[\s\S]*?<\/\1>/gi, "");
        // Remove any leftover or unpaired tags
        text = text.replace(/<\/?(think|thought)>/gi, "").trim();

        // ── Strip Graphical Emojis ───────────────────────────────
        // This regex targets common Unicode emoji ranges
        text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F3FB}-\u{1F3FF}\u{1F170}-\u{1F251}]/gu, "");

        // ── TTS (graceful fallback if no key) ────────────────────
        let audioBase64: string | null = null;
        let visemes: unknown[] = [];
        let duration = 3;

        return NextResponse.json({ text, audioBase64, visemes, duration });
    } catch (err: unknown) {
        const error = err as Error;
        console.error("/api/chat error:", error);
        // Do NOT expose error.message to clients — it may contain internal details
        return NextResponse.json({ 
            error: "Internal server error"
        }, { status: 500 });
    }
}
