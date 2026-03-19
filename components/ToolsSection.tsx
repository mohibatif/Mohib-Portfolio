"use client";
import styles from "./ToolsSection.module.css";
import { SectionReveal } from "./SectionReveal";
import { motion } from "framer-motion";
import Image from "next/image";
import { ME } from "@/lib/knowledge/me";
import { ScrambleText } from "./ScrambleText";

export function ToolsSection() {
    return (
        <SectionReveal>
            <section className={styles.section}>
                <div className={styles.headerRow}>
                    <ScrambleText text="// TOOLS I ❤️ LOVE" className={styles.heading} />
                    <motion.div 
                        className={styles.line} 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    />
                </div>

                <div className={styles.grid}>
                    <div className={styles.subSection}>
                        <h3 className={styles.subHeading}>CODE</h3>
                        <div className={styles.toolsList}>
                            {ME.tools?.code.map((tool) => (
                                <div key={tool.name} className={styles.tool}>
                                    <div className={styles.iconContainer}>
                                        <Image 
                                            src={tool.icon} 
                                            alt={tool.name} 
                                            width={18} 
                                            height={18} 
                                            className={styles.icon}
                                        />
                                    </div>
                                    <span>{tool.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.subSection}>
                        <h3 className={styles.subHeading}>DESIGN</h3>
                        <div className={styles.toolsList}>
                            {ME.tools?.design.map((tool) => (
                                <div key={tool.name} className={styles.tool}>
                                    <div className={styles.iconContainer}>
                                        <Image 
                                            src={tool.icon} 
                                            alt={tool.name} 
                                            width={18} 
                                            height={18} 
                                            className={styles.icon}
                                        />
                                    </div>
                                    <span>{tool.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </SectionReveal>
    );
}
