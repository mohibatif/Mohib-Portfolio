"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./AsciiAvatar.module.css";

interface AsciiAvatarProps {
  isTalking: boolean;
  visemeIntensity?: number;
}

export function AsciiAvatar({ isTalking, visemeIntensity = 0 }: AsciiAvatarProps) {
  const [frame, setFrame] = useState(0);
  const [blink, setBlink] = useState(false);
  const [yOffset, setYOffset] = useState(0);

  // Animation loop
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const animate = () => {
      setFrame(f => (f + 1) % 100);
      timeout = setTimeout(animate, 150);
    };
    animate();
    return () => clearTimeout(timeout);
  }, []);

  // Blinking logic
  useEffect(() => {
    const triggerBlink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
      setTimeout(triggerBlink, 3000 + Math.random() * 4000);
    };
    const timer = setTimeout(triggerBlink, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Breathing/Floating logic
  useEffect(() => {
    const move = () => {
      setYOffset(Math.sin(Date.now() / 800) * 0.5);
      requestAnimationFrame(move);
    };
    const id = requestAnimationFrame(move);
    return () => cancelAnimationFrame(id);
  }, []);

  const eyes = blink ? "-   -" : "o   o";
  
  // Mouth logic based on talking state
  const getMouth = useCallback(() => {
    if (!isTalking) return " ———— ";
    const mouths = [" === ", " OOO ", " --- ", " ... ", " === "];
    return mouths[frame % mouths.length];
  }, [isTalking, frame]);

  const robotArt = useMemo(() => {
    const mouth = getMouth();
    return `
      <span class="${styles.accent}">     _________________</span>
      <span class="${styles.accent}">    /                 \\</span>
      <span class="${styles.accent}">   |   <span class="${styles.eye}">${eyes}</span>   |</span>
      <span class="${styles.accent}">   |      <span class="${styles.eye}">^</span>      |</span>
      <span class="${styles.accent}">   |    <span class="${styles.mouth}">${mouth}</span>    |</span>
      <span class="${styles.accent}">    \\_________________/</span>
      <span class="${styles.accent}">           | |</span>
      <span class="${styles.accent}">      _____| |_____</span>
      <span class="${styles.accent}">     /             \\</span>
      <span class="${styles.accent}">    |               |</span>
      <span class="${styles.accent}">    |       <span class="${styles.eye}">✦</span>       |</span>
      <span class="${styles.accent}">    |               |</span>
      <span class="${styles.accent}">     \\_____________/</span>
    `;
  }, [eyes, getMouth]);

  return (
    <div className={styles.asciiWrapper}>
      <pre 
        className={`${styles.ascii} ${isTalking ? styles.talking : ""}`}
        style={{ transform: `translateY(${yOffset}px)` }}
        dangerouslySetInnerHTML={{ __html: robotArt }}
      />
    </div>
  );
}
