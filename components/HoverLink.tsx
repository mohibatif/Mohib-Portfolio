"use client";
import React from "react";
import styles from "./HoverLink.module.css";

interface HoverLinkProps {
  href: string;
  children: React.ReactNode;
  iconSrc: string;
  iconClassName?: string;
}

export function HoverLink({ href, children, iconSrc, iconClassName }: HoverLinkProps) {
  return (
    <a
      href={href}
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={iconSrc}
        alt=""
        draggable={false}
        className={`${styles.icon} ${iconClassName || ""}`}
      />
      <span>{children}</span>
    </a>
  );
}
