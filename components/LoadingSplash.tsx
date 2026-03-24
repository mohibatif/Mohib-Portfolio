"use client";
import { useEffect, useState } from "react";
import styles from "./LoadingSplash.module.css";

const DOT_FRAMES = [".", "..", "..."];

export function LoadingSplash() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [showTap, setShowTap] = useState(false);

  const fullText = 'cout << "Hello World!";';

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypewriterText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowTap(true), 400);
        setIsLoaded(true);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    if (!showTap) return;
    
    // Prime the Haptic API
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(15);
      } catch (err) {}
    }

    setFadeOut(true);
    setTimeout(() => setVisible(false), 600);
  };

  if (!visible) return null;

  return (
    <div 
      className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ""} ${showTap ? styles.interactive : ""}`}
      onClick={handleEnter}
      role={showTap ? "button" : undefined}
      tabIndex={showTap ? 0 : -1}
      onKeyDown={(e) => e.key === "Enter" && handleEnter()}
    >
      <div className={styles.content}>
        <div className={styles.codeLine}>
          <span className={styles.typewriter}>{typewriterText}</span>
          {!showTap && <span className={styles.consoleCursor}>|</span>}
        </div>
        
        {showTap && (
          <div className={`${styles.codeLine} ${styles.promptLine}`}>
            <span className={styles.label}>cin &gt;&gt;&nbsp;</span>
            <span className={styles.tapText}>Tap Here;</span>
          </div>
        )}
      </div>
    </div>
  );
}
