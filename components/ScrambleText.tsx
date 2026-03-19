"use client";
import React, { useState, useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export function ScrambleText({ text, className }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iterationRef = useRef(0);

  const startScramble = () => {
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
  };

  const stopScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplay(text);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span 
      className={className} 
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
      style={{ cursor: "default" }}
    >
      {display}
    </span>
  );
}
