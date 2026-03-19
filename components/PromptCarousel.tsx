"use client";
import { useState } from "react";
import styles from "./PromptCarousel.module.css";

const DEFAULT_PROMPTS = [
    "Tell me about your projects",
    "What's your passion?",
    "What's your background?",
];

interface PromptCarouselProps {
    conversationOn: boolean;
    onSendPrompt: (prompt: string) => void;
}

export function PromptCarousel({ conversationOn, onSendPrompt }: PromptCarouselProps) {
    const [idx, setIdx] = useState(0);

    const prev = () => setIdx((i) => (i - 1 + DEFAULT_PROMPTS.length) % DEFAULT_PROMPTS.length);
    const next = () => setIdx((i) => (i + 1) % DEFAULT_PROMPTS.length);

    const handleClick = () => {
        if (conversationOn) onSendPrompt(DEFAULT_PROMPTS[idx]);
    };

    return (
        <div className={styles.row}>
            <button className={styles.navBtn} onClick={prev} aria-label="Previous prompt">‹</button>

            <button
                className={`${styles.prompt} ${conversationOn ? styles.active : styles.inactive}`}
                onClick={handleClick}
                disabled={!conversationOn}
            >
                <span className={styles.glyph}>↳</span>
                <span className={styles.text}>{DEFAULT_PROMPTS[idx]}</span>
            </button>

            <button className={styles.navBtn} onClick={next} aria-label="Next prompt">›</button>
        </div>
    );
}
