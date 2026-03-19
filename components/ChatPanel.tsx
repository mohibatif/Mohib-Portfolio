"use client";
import { useRef, useEffect, useState, useCallback, KeyboardEvent } from "react";
import styles from "./ChatPanel.module.css";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    loading?: boolean;
}

interface ChatPanelProps {
    isOpen: boolean;
    ownerInitials: string;
    ownerName: string;
    onAudioReady: (duration: number) => void;
    onLoadingChange?: (loading: boolean) => void;
}

const QUICK_PROMPTS = [
    "Tell me about your projects",
    "What's your passion?",
    "What's your background?",
];

export function ChatPanel({ isOpen, ownerInitials, ownerName, onAudioReady, onLoadingChange }: ChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: "intro", role: "assistant", content: `Hi! I'm ${ownerName}'s AI clone. Ask me anything about my work, background, or experience.` },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
    }, [isOpen]);

    // Scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const setLoading = useCallback((v: boolean) => {
        setIsLoading(v);
        onLoadingChange?.(v);
    }, [onLoadingChange]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;
        const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
        const placeholder: Message = { id: "loading", role: "assistant", content: "", loading: true };
        setMessages((p) => [...p, userMsg, placeholder]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    history: messages.map((m) => ({ role: m.role, content: m.content })),
                }),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.details || errData.error || "API error");
            }
            const data = await res.json() as { text: string; audioBase64: string | null; duration: number };

            setMessages((p) => [
                ...p.filter((m) => m.id !== "loading"),
                { id: `a-${Date.now()}`, role: "assistant", content: data.text },
            ]);

            if (data.audioBase64) {
                const blob = new Blob(
                    [Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))],
                    { type: "audio/mpeg" }
                );
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.onended = () => URL.revokeObjectURL(url);
                audio.play().catch(() => { });
                onAudioReady(data.duration ?? 3);
            }
        } catch (err: any) {
            setMessages((p) => [
                ...p.filter((m) => m.id !== "loading"),
                { id: `err-${Date.now()}`, role: "assistant", content: `Error: ${err.message || "Something went wrong. Please check your API keys."}` },
            ]);
        } finally {
            setLoading(false);
        }
    }, [messages, isLoading, onAudioReady, setLoading]);

    // Listen for external send events (from prompt carousel)
    useEffect(() => {
        const handler = (e: Event) => {
            const text = (e as CustomEvent<string>).detail;
            sendMessage(text);
        };
        window.addEventListener("portfolio:send", handler);
        return () => window.removeEventListener("portfolio:send", handler);
    }, [sendMessage]);

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
    };

    const initials = ownerInitials.toLowerCase();

    // ── Group messages into User/AI pairs ──────────────────
    const pairs: { user: Message | null; ai: Message | null }[] = [];
    let currentPair: { user: Message | null; ai: Message | null } = { user: null, ai: null };

    messages.forEach((msg) => {
        if (msg.role === "assistant" && msg.id === "intro") {
            // Intro message is standalone
            pairs.push({ user: null, ai: msg });
        } else if (msg.role === "user") {
            if (currentPair.user) {
                // Should not happen, but push if previous pair was incomplete
                pairs.push(currentPair);
            }
            currentPair = { user: msg, ai: null };
        } else if (msg.role === "assistant") {
            currentPair.ai = msg;
            pairs.push(currentPair);
            currentPair = { user: null, ai: null };
        }
    });
    // Push any trailing incomplete pair (e.g., user asked, waiting for AI)
    if (currentPair.user || currentPair.ai) {
        pairs.push(currentPair);
    }

    return (
        <div className={`${styles.panel} ${isOpen ? styles.open : ""}`}>
            <div className={styles.history}>
                {pairs.map((pair, index) => (
                    <div key={pair.user?.id || pair.ai?.id || index} className={styles.interactionBlock}>
                        
                        {/* 1. User Message */}
                        {pair.user && (
                            <div className={styles.msgRow}>
                                <span className={styles.dotLabel}>:.</span>
                                <span className={styles.msgContent}>{pair.user.content}</span>
                            </div>
                        )}

                        {/* 2. AI Response */}
                        {pair.ai && (
                            <div className={styles.msgRow}>
                                <span className={styles.colonLabel}>::</span>
                                <span className={styles.msgContent}>
                                    {pair.ai.loading
                                        ? <><span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} /></>
                                        : pair.ai.content
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
