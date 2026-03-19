"use client";
import styles from "./ProjectsGrid.module.css";
import { ME } from "@/lib/knowledge/me";
import { SectionReveal } from "./SectionReveal";
import { motion } from "framer-motion";
import { ScrambleText } from "./ScrambleText";

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
                        <a
                            key={update.name}
                            href={update.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.card}
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
                    ))}
                </div>
            </section>
        </SectionReveal>
    );
}
