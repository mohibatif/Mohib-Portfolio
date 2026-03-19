"use client";
import { useState, useRef, useCallback } from "react";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    loading?: boolean;
}

interface UseChatReturn {
    messages: Message[];
    isLoading: boolean;
    sendMessage: (text: string) => Promise<void>;
}

export function useChat(
    onAudioReady: (audioUrl: string, duration: number) => void
): UseChatReturn {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "intro",
            role: "assistant",
            content: "Hey! I'm an AI clone trained on everything about me — ask me about my projects, skills, or experience.",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() || isLoading) return;
            const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
            const placeholderMsg: Message = { id: "loading", role: "assistant", content: "", loading: true };

            setMessages((prev) => [...prev, userMsg, placeholderMsg]);
            setIsLoading(true);

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: text,
                        history: messages.map((m) => ({ role: m.role, content: m.content })),
                    }),
                });

                if (!res.ok) throw new Error("API error");

                const data = await res.json() as {
                    text: string;
                    audioBase64: string | null;
                    duration: number;
                };

                const assistantMsg: Message = {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: data.text,
                };

                setMessages((prev) => [...prev.filter((m) => m.id !== "loading"), assistantMsg]);

                // Play audio if available
                if (data.audioBase64) {
                    const blob = new Blob(
                        [Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))],
                        { type: "audio/mpeg" }
                    );
                    const url = URL.createObjectURL(blob);

                    if (audioRef.current) {
                        audioRef.current.pause();
                        URL.revokeObjectURL(audioRef.current.src);
                    }

                    const audio = new Audio(url);
                    audioRef.current = audio;
                    audio.onended = () => URL.revokeObjectURL(url);
                    audio.play().catch(() => { });
                    onAudioReady(url, data.duration ?? 3);
                }
            } catch (err) {
                setMessages((prev) => [
                    ...prev.filter((m) => m.id !== "loading"),
                    {
                        id: "err",
                        role: "assistant",
                        content: "Sorry, something went wrong. Make sure API keys are configured.",
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        },
        [messages, isLoading, onAudioReady]
    );

    return { messages, isLoading, sendMessage };
}
