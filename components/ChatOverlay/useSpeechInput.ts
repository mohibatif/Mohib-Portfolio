"use client";
import { useRef, useCallback, useState } from "react";

interface UseSpeechInputReturn {
    isListening: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    supported: boolean;
}

export function useSpeechInput(onResult: (text: string) => void): UseSpeechInputReturn {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef<any>(null);

    const supported =
        typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

    const startListening = useCallback(() => {
        if (!supported) return;
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (e: any) => {
            const t = Array.from(e.results)
                .map((r: any) => r[0].transcript)
                .join("");
            setTranscript(t);
            if (e.results[e.results.length - 1].isFinal) {
                onResult(t);
                setTranscript("");
            }
        };

        recognition.start();
    }, [supported, onResult]);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
    }, []);

    return { isListening, transcript, startListening, stopListening, supported };
}
