"use client";
import styles from "./ProjectsGrid.module.css";
import { ME } from "@/lib/knowledge/me";
import { SectionReveal } from "./SectionReveal";
import { motion, useInView } from "framer-motion";
import { ScrambleText } from "./ScrambleText";
import { useRef, useEffect } from "react";

// Placeholder gradients matching the reference dark aesthetic
const GRADIENTS = [
    "linear-gradient(to bottom right, #111, #222)",
    "linear-gradient(to bottom right, #1a1a1a, #0a0a0a)",
    "linear-gradient(to bottom right, #222, #111)",
    "linear-gradient(to bottom right, #0a0a0a, #1a1a1a)",
];

import Image from "next/image";

export default function ProjectsGrid() {
    return (
        <SectionReveal>
            <section className={styles.section}>
                <div className={styles.headerRow}>
                    <ScrambleText text="// UPDATES" className={styles.heading} />
                    <motion.div 
                        className={styles.line} 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    />
                </div>

                <div className={styles.grid}>
                    {ME.updates.map((update) => (
                        <ProjectCard key={update.name} update={update} />
                    ))}
                </div>
            </section>
        </SectionReveal>
    );
}

function ProjectCard({ update }: { update: any }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { 
        amount: 0.6,
        // Using once: false to allow repeated highlighting
    });

    // Handle haptic vibration on mobile when entering focus
    useEffect(() => {
        if (isInView && typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            // Short, subtle haptic "click"
            try {
                window.navigator.vibrate(10);
            } catch (err) {}
        }
    }, [isInView]);

    return (
        <a
            ref={ref}
            href={update.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.card} ${isInView ? styles.cardActive : styles.cardInactive}`}
        >
            {/* Thumbnail */}
            <div className={styles.thumbnail}>
                <Image 
                    src={update.imageUrl}
                    alt={update.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 640px) 100vw, 50vw"
                />
            </div>

            {/* Info */}
            <div className={styles.info}>
                <p className={styles.name}>{update.name}</p>
                <p className={styles.desc}>{update.description}</p>
            </div>
        </a>
    );
}
