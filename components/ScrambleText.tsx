"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export function ScrambleText({ text, className }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iterationRef = useRef(0);
  const [isHovering, setIsHovering] = useState(false);

  const startScramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    iterationRef.current = 0;

    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx < iterationRef.current) return text[idx];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iterationRef.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iterationRef.current += 1/3;
    }, 30);
  }, [text]);

  const stopScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplay(text);
  };

  // Manual scramble on hover
  const handleMouseEnter = () => {
    setIsHovering(true);
    startScramble();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    stopScramble();
  };

  // Automatic scramble every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isHovering) startScramble();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isHovering, startScramble]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span 
      className={className} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "default" }}
    >
      {display}
    </span>
  );
}

