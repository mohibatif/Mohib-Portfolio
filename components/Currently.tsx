"use client";
import styles from "./Currently.module.css";
import { HoverLink } from "./HoverLink";
import { SectionReveal } from "./SectionReveal";
import { motion } from "framer-motion";
import { ScrambleText } from "./ScrambleText";

export function Currently() {
    return (
        <SectionReveal>
            <section className={styles.section}>
                <div className={styles.headerRow}>
                    <ScrambleText text="// CURRENTLY" className={styles.heading} />
                    <motion.div
                        className={styles.line}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    />
                </div>

                <div className={styles.statusContainer}>
                    <motion.div
                        className={styles.statusPill}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <span className={styles.statusDot} />
                        Open to work — Design & AI roles
                    </motion.div>
                </div>

                <ul className={styles.list}>
                    <li className={styles.item}>
                        <span className={styles.arrow}>&gt;</span>
                        <span className={styles.text}>
                            BS Artificial Intelligence @ <HoverLink href="https://www.umt.edu.pk/" iconSrc="/logos/umt.svg">UMT</HoverLink>
                        </span>
                    </li>
                    <li className={styles.item}>
                        <span className={styles.arrow}>&gt;</span>
                        <span className={styles.text}>
                            Participant @ <HoverLink href="https://codeinplace.stanford.edu/" iconSrc="/logos/stanford.svg">Stanford - Code in Place</HoverLink>
                        </span>
                    </li>
                    <li className={styles.item}>
                        <span className={styles.arrow}>&gt;</span>
                        <span className={styles.text}>
                            Campus Lead @ <HoverLink href="https://gdg.community.dev/gdg-on-campus-university-of-management-and-technology-lahore-pakistan/" iconSrc="/logos/gdg.svg">Google Developer Group</HoverLink>
                        </span>
                    </li>
                    <li className={styles.item}>
                        <span className={styles.arrow}>&gt;</span>
                        <span className={styles.text}>
                            President @ <HoverLink href="https://surgeumt.com/" iconSrc="/logos/surge.png">Surge UMT</HoverLink>
                        </span>
                    </li>
                    <li className={styles.item}>
                        <span className={styles.arrow}>&gt;</span>
                        <span className={styles.text}>
                            Design Lead @ <HoverLink href="https://www.instagram.com/tech.tehwaar/" iconSrc="/logos/Tech_Tehwaar_Logo.svg" iconClassName={styles.techTehwaarIcon}>Tech Tehwaar</HoverLink>
                        </span>
                    </li>
                    <li className={styles.item}>
                        <span className={styles.arrow}>&gt;</span>
                        <span className={styles.text}>
                            Ambassador @ <HoverLink href="#" iconSrc="/logos/devsinc.svg" iconClassName={styles.devsincIcon}>Devsinc</HoverLink>
                        </span>
                    </li>
                </ul>
            </section>
        </SectionReveal>
    );
}
