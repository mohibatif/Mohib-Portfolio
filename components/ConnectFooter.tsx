"use client";
import styles from "./ConnectFooter.module.css";
import { ME } from "@/lib/knowledge/me";
import { SectionReveal } from "./SectionReveal";
import { motion } from "framer-motion";
import Image from "next/image";
import { ScrambleText } from "./ScrambleText";

export function ConnectFooter() {
    return (
        <SectionReveal>
            <footer className={styles.footer}>
                {/* ── Ruled header "CONNECT" ────────────────── */}
                <div className={styles.headerRow}>
                    <motion.div 
                        className={styles.line} 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    />
                    <ScrambleText text="CONNECT" className={styles.heading} />
                    <motion.div 
                        className={styles.line} 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        style={{ transformOrigin: "right" }}
                    />
                </div>

                {/* ── Icon links ────────────────────────────── */}
                <div className={styles.links}>
                    <a href={`mailto:${ME.social.email}`} className={styles.link}>
                        <Image src="/logos/mail.svg" alt="Mail" width={15} height={11} className={styles.icon} /> 
                        Email
                    </a>
                    <span className={styles.sep}>/</span>
                    <a href={ME.social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        <Image src="/logos/linkedin.svg" alt="LinkedIn" width={10} height={11} className={styles.icon} /> 
                        LinkedIn
                    </a>
                    <span className={styles.sep}>/</span>
                    <a href={ME.social.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        <Image src="/logos/github.png" alt="GitHub" width={12} height={12} className={styles.icon} /> 
                        GitHub
                    </a>
                    <span className={styles.sep}>/</span>
                    <a href={ME.social.behance} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        <Image src="/logos/behance.svg" alt="Behance" width={20} height={14} className={styles.icon} /> 
                        Behance
                    </a>
                </div>

                <p className={styles.tagline}>DESIGNED & BUILT BY {ME.name}</p>
            </footer>
        </SectionReveal>
    );
}
