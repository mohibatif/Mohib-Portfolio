"use client";
import React, { useMemo } from "react";
import styles from "./LEDText.module.css";
import { charMap } from "./LEDTextMap";

interface LEDTextProps {
  text: string;
  dotSize?: number;
  gap?: number;
  color?: string;
  glowColor?: string;
  backgroundGlow?: string;
  className?: string;
  /** Number of dots wide per column — set to 2 for bold/wide look */
  stroke?: number;
  /** Number of dots high per row — set to 2 for taller look */
  vStroke?: number;
}

export function LEDText({
  text,
  dotSize = 6,
  gap = 2,
  color = "#222",
  glowColor = "#D0D0D0",
  backgroundGlow = "rgba(208, 208, 208, 0.3)",
  className = "",
  stroke = 1,
  vStroke = 1,
}: LEDTextProps) {
  // Convert string into array of 5x7 matrices
  const matrices = useMemo(() => {
    return text.toUpperCase().split("").map((char) => {
      // Fallback to empty space for unknown characters
      return charMap[char] || [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];
    });
  }, [text]);

  return (
    <div
      className={`${styles.ledContainer} ${className}`}
      style={
        {
          "--dot-size": `${dotSize}px`,
          "--gap": `${gap}px`,
          "--color-off": color,
          "--color-on": glowColor,
          "--glow": backgroundGlow,
        } as React.CSSProperties
      }
    >
      {matrices.map((matrix: number[][], charIdx: number) => (
        <div key={`${charIdx}-${text[charIdx]}`} className={styles.character}>
          {matrix.map((row: number[], y: number) =>
            Array.from({ length: vStroke }).map((_, vs) => (
              <div key={`${y}-${vs}`} className={styles.row}>
                {row.map((val: number, x: number) =>
                  Array.from({ length: stroke }).map((_, s) => (
                    <div
                      key={`${x}-${y}-${s}-${vs}`}
                      className={`${styles.dot} ${val === 1 ? styles.active : ""} ${
                        val === 1 && (Math.sin(charIdx * 29 + (y * vStroke + vs) * 11 + (x * stroke + s) * 7) > -0.2)
                          ? styles.blinking
                          : ""
                      }`}
                      style={
                        val === 1
                          ? ({
                              "--twinkle-delay": `${(( (charIdx * 131 + (y * vStroke + vs) * 17 + (x * stroke + s) * 7) % 100) / 20).toFixed(2)}s`,
                              "--glitch-duration": `${(0.18 + ((charIdx * 13 + (y * vStroke + vs) * 7 + (x * stroke + s) * 3) % 10) / 20).toFixed(2)}s`,
                              "--glitch-delay": `${((charIdx * 7 + (y * vStroke + vs) * 3 + (x * stroke + s)) % 50) / 10}s`,
                              "--base-opacity": (charIdx * 11 + (y * vStroke + vs) * 7 + (x * stroke + s) * 3) % 4 === 0 ? "0.2" : "1",
                            } as React.CSSProperties)
                          : {}
                      }
                    />
                  ))
                )}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
