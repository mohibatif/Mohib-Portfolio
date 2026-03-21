"use client";
import { useEffect, useState } from "react";
import styles from "./LoadingSplash.module.css";

const DOT_FRAMES = [".", "..", "..."];

export function LoadingSplash() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [dotFrame, setDotFrame] = useState(0);

  // Cycle dots
  useEffect(() => {
    const id = setInterval(() => setDotFrame(f => (f + 1) % DOT_FRAMES.length), 380);
    return () => clearInterval(id);
  }, []);

  // Fade out then unmount
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1400);
    const removeTimer = setTimeout(() => setVisible(false), 1900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ""}`}>
      <div className={styles.content}>
        <span className={styles.label}>Loading</span>
        <span className={styles.dots} aria-hidden="true">{DOT_FRAMES[dotFrame]}</span>
      </div>
    </div>
  );
}
