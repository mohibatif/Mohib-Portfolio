"use client";
import React, { useState } from "react";
import styles from "./HoverLink.module.css";
import { Press_Start_2P } from "next/font/google";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

interface HoverLinkProps {
  href: string;
  children: React.ReactNode;
  iconSrc: string;
  iconClassName?: string;
}

export function HoverLink({ href, children, iconSrc, iconClassName }: HoverLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className={`${styles.container} ${isHovered ? styles.hoveredContainer : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={iconSrc} alt="" className={`${styles.icon} ${iconClassName || ""}`} />
      
      <span className={`${styles.text} ${pixelFont.className}`}>
        {children}
      </span>
    </a>
  );
}
