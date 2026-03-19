"use client";
import styles from "./ASCIIHeader.module.css";

// The client will replace these template literals with their ASCII art
// Copy content verbatim from the provided .txt files — whitespace is significant
const FIRST_NAME_ASCII = `
 __  __  ___  _   _ ___ ____
|  \\/  |/ _ \\| | | |_ _| __ )
| |\\/| | | | | |_| || ||  _ \\
| |  | | |_| |  _  || || |_) |
|_|  |_|\\___/|_| |_|___|____/
`.trim();

const LAST_NAME_ASCII = `
    _  _____ ___ _____
   / \\|_   _|_ _|  ___|
  / _ \\ | |  | || |_
 / ___ \\| |  | ||  _|
/_/   \\_\\_| |___|_|
`.trim();

export function ASCIIHeader() {
    return (
        <header className={styles.header}>
            <pre className={styles.firstName}>{FIRST_NAME_ASCII}</pre>
            <pre className={styles.lastName}>{LAST_NAME_ASCII}</pre>
        </header>
    );
}
