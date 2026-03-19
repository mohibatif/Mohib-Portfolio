"use client";
import { useRef, useEffect } from "react";
import styles from "./ConversationMode.module.css";

interface ConversationModeProps {
    isOn: boolean;
    isLoading: boolean;
    onToggle: () => void;
}

export function ConversationMode({ isOn, isLoading, onToggle }: ConversationModeProps) {
    return (
        <div className={styles.row}>
            <span className={styles.label}>CONVERSATION MODE</span>

            {isLoading && <span className={`${styles.spinner} spinner`} aria-label="Generating…" />}

            <button
                className={`${styles.toggle} ${isOn ? styles.on : styles.off}`}
                onClick={onToggle}
                aria-pressed={isOn}
            >
                {isOn ? "ON" : "OFF"}
            </button>
        </div>
    );
}
