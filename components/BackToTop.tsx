"use client";
import { useEffect, useState } from "react";
import styles from "./BackToTop.module.css";
import Image from "next/image";

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            className={`${styles.button} ${isVisible ? styles.visible : ""}`}
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            <Image
                src="/btt_button.svg"
                alt="Back to top"
                width={42}
                height={42}
                className={styles.icon}
            />
        </button>
    );
}
