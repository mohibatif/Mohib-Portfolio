"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

interface HeroProps {
    onChatOpen: () => void;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function useScramble(target: string, delay: number = 0) {
    const [display, setDisplay] = useState("");
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        let iteration = 0;

        const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
            interval = setInterval(() => {
                setDisplay(
                    target
                        .split("")
                        .map((char, idx) => {
                            if (char === " " || char === "\u00a0") return char;
                            if (idx < iteration) return target[idx];
                            return CHARS[Math.floor(Math.random() * CHARS.length)];
                        })
                        .join("")
                );
                if (iteration >= target.length) clearInterval(interval);
                iteration += 0.5;
            }, 30);
        }, delay);

        return () => { clearTimeout(timeout); if (interval) clearInterval(interval); };
    }, [target, delay]);
    return display;
}

export default function Hero({ onChatOpen }: HeroProps) {
    const name = useScramble("Mohib\u00a0\u00a0Atif", 300);
    const [subtitleVisible, setSubtitleVisible] = useState(false);
    const [ctaVisible, setCtaVisible] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setSubtitleVisible(true), 900);
        const t2 = setTimeout(() => setCtaVisible(true), 1300);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.inner}>
                <p className={styles.label}>Portfolio</p>

                <h1 className={styles.name}>{name || "\u00a0"}</h1>

                <p className={`${styles.subtitle} ${subtitleVisible ? styles.visible : ""}`}>
                    Designer. Builder. AI Enthusiast.
                    <br />
                    Studying at{" "}
                    <span className={styles.highlight}>University of Management & Technology.</span>
                </p>

                <div className={`${styles.actions} ${ctaVisible ? styles.visible : ""}`}>
                    <button className={styles.chatBtn} onClick={onChatOpen}>
                        <span className={styles.chatDot} />
                        Chat with my AI clone
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <div className={styles.socials}>
                        <a href="https://github.com/mohibatif" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>GitHub</a>
                        <span className={styles.sep}>·</span>
                        <a href="https://www.linkedin.com/in/iamohib/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>LinkedIn</a>
                        <span className={styles.sep}>·</span>
                        <a href="mailto:mohibatif9@gmail.com" className={styles.socialLink}>Email</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
