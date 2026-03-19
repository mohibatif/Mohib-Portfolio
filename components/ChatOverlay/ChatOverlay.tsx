"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import styles from "./ChatOverlay.module.css";
import { useChat } from "./useChat";
import { useSpeechInput } from "./useSpeechInput";

interface ChatOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onAudioReady: (duration: number) => void;
}

export function ChatOverlay({ isOpen, onClose, onAudioReady }: ChatOverlayProps) {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAudio = useCallback(
        (_url: string, duration: number) => {
            onAudioReady(duration);
        },
        [onAudioReady]
    );

    const { messages, isLoading, sendMessage } = useChat(handleAudio);

    const handleSend = useCallback(async () => {
        const text = input.trim();
        if (!text) return;
        setInput("");
        await sendMessage(text);
    }, [input, sendMessage]);

    const { isListening, transcript, startListening, stopListening, supported } =
        useSpeechInput(useCallback((text: string) => sendMessage(text), [sendMessage]));

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
    }, [isOpen]);

    // Escape to close
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`}>
            {/* Backdrop */}
            <div className={styles.backdrop} onClick={onClose} />

            <div className={styles.panel}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <span className={styles.statusDot} />
                        <span className={styles.headerTitle}>AI Clone</span>
                        <span className={styles.headerSub}>— ask me anything</span>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className={styles.messages}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`${styles.msg} ${styles[msg.role]}`}>
                            {msg.loading ? (
                                <span className={styles.typing}>
                                    <span /><span /><span />
                                </span>
                            ) : (
                                <p className={styles.msgText}>{msg.content}</p>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={styles.inputRow}>
                    {supported && (
                        <button
                            className={`${styles.micBtn} ${isListening ? styles.listening : ""}`}
                            onClick={isListening ? stopListening : startListening}
                            aria-label="Voice input"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <rect x="5" y="1" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.3" />
                                <path d="M2.5 8.5A5.5 5.5 0 0 0 8 14a5.5 5.5 0 0 0 5.5-5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                <line x1="8" y1="14" x2="8" y2="15.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                        </button>
                    )}
                    <input
                        ref={inputRef}
                        className={styles.input}
                        value={isListening ? transcript : input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder={isListening ? "Listening…" : "Ask me anything…"}
                        disabled={isLoading || isListening}
                    />
                    <button
                        className={styles.sendBtn}
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        aria-label="Send"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Suggestions */}
                {messages.length <= 1 && !isLoading && (
                    <div className={styles.suggestions}>
                        {["What are your top projects?", "What's your tech stack?", "Tell me about your experience"].map((s) => (
                            <button key={s} className={styles.suggestion} onClick={() => sendMessage(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
