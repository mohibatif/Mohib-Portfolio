"use client";
import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import styles from "./ChatInterface.module.css";
import Image from "next/image";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    loading?: boolean;
}

interface ChatInterfaceProps {
  ownerName: string;
}

const ALL_QUICK_PROMPTS = [
  "What projects are you working on?",
  "What's your travel story?",
  "Which semester are you in?", // Matches "studies i am currently in 6th semester"
  "What are your hobbies?", // Matches "skecth, art"
  "Tell me about your design style", // Matches "design"
  "Do you like photography?", // Matches "photography"
  "Available for work?",
  "Tell me about your AI clone",
  "What does AI mean to you?",
];

const SUGGESTED_QUESTIONS = [
  "What projects are you working on?",
  "What interests you most?",
];

const playClickSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // A quick, pleasant "pop" sound
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (err) {}
};

export function ChatInterface({
  ownerName
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activePrompts, setActivePrompts] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingIds, setTypingIds] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("CHAT WITH MOHIB'S CLONE");
  
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);

  // Cryptic transition effect
  const animateTitle = useCallback((target: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    let iterations = 0;
    const interval = setInterval(() => {
      setHeaderTitle(prev => 
        target.split("")
          .map((char, index) => {
            if (index < iterations) return target[index];
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      if (iterations >= target.length) clearInterval(interval);
      iterations += 1/3;
    }, 30);
  }, []);

  // Initialize random prompts
  useEffect(() => {
    handleShuffle();
  }, []);

  // Trigger title change on first message
  useEffect(() => {
    if (messages.length > 0 && headerTitle === "CHAT WITH MOHIB'S CLONE") {
      animateTitle("CHIT-CHAT TERMINAL");
    }
  }, [messages.length, headerTitle, animateTitle]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
      if (!text.trim() || isLoading) return;
      const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
      const placeholder: Message = { id: "loading", role: "assistant", content: "", loading: true };
      setMessages((p) => [...p, userMsg, placeholder]);
      setInput("");
      setIsLoading(true);

      try {
          const res = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  message: text,
                  history: messages.map((m) => ({ role: m.role, content: m.content })),
              }),
          });
          if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.details || errData.error || "API error");
          }
          const data = await res.json() as { text: string };
          const aiId = `a-${Date.now()}`;

          setTypingIds(prev => new Set(prev).add(aiId));
          setMessages((p) => [
              ...p.filter((m) => m.id !== "loading"),
              { id: aiId, role: "assistant", content: data.text },
          ]);
      } catch (err: any) {
          setMessages((p) => [
              ...p.filter((m) => m.id !== "loading"),
              { id: `err-${Date.now()}`, role: "assistant", content: `Error: ${err.message || "Something went wrong."}` },
          ]);
      } finally {
          setIsLoading(false);
      }
  }, [messages, isLoading]);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Group messages into Q&A pairs
  const pairs: { user: Message | null; ai: Message | null }[] = [];
  let currentPair: { user: Message | null; ai: Message | null } = { user: null, ai: null };

  messages.forEach((msg) => {
      if (msg.role === "user") {
          if (currentPair.user) pairs.push(currentPair);
          currentPair = { user: msg, ai: null };
      } else if (msg.role === "assistant") {
          currentPair.ai = msg;
          pairs.push(currentPair);
          currentPair = { user: null, ai: null };
      }
  });
  if (currentPair.user || currentPair.ai) {
      pairs.push(currentPair);
  }
  
  const handleShuffle = () => {
    const shuffled = [...ALL_QUICK_PROMPTS].sort(() => 0.5 - Math.random());
    setActivePrompts(shuffled.slice(0, 3));
  };

  const handleTypewriterComplete = useCallback((id?: string) => {
    if (!id) return;
    setTypingIds(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const recognitionRef = useRef<any>(null);
  const originalInputRef = useRef<string>("");

  // Store ref to the polling interval
  const previewIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startFallbackRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        recordingStartTimeRef.current = Date.now();

        let isTranscribingPreview = false;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        // Poll Gemini continuously every 2 seconds for a live preview text
        previewIntervalRef.current = setInterval(async () => {
          if (mediaRecorder.state === "inactive") return;
          if (audioChunksRef.current.length === 0) return;
          if (isTranscribingPreview) return; // Wait until previous preview request finished

          isTranscribingPreview = true;
          try {
             // Create blob of what we have SO FAR
             const currentBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
             if (currentBlob.size > 0) {
                 const reader = new FileReader();
                 reader.readAsDataURL(currentBlob);
                 reader.onloadend = async () => {
                   const base64data = reader.result as string;
                   if (!base64data || !base64data.includes(',')) {
                      isTranscribingPreview = false; return;
                   }
                   const base64String = base64data.split(',')[1];
                   
                   try {
                     const res = await fetch("/api/transcribe", {
                       method: "POST",
                       headers: { "Content-Type": "application/json" },
                       body: JSON.stringify({ 
                         audioBase64: base64String,
                         mimeType: mediaRecorder.mimeType || "audio/webm"
                       }), // Using the SAME robust transcription endpoint
                     });
                     if (res.ok) {
                       const data = await res.json();
                       if (data.text) {
                         // Update UI immediately while still recording!
                         const newText = originalInputRef.current 
                           ? `${originalInputRef.current} ${data.text}`.trim()
                           : data.text;
                         setInput(newText);
                       }
                     }
                   } catch(err) {}
                   isTranscribingPreview = false;
                 };
             } else {
                 isTranscribingPreview = false;
             }
          } catch (e) {
             isTranscribingPreview = false;
          }
        }, 2000);

        mediaRecorder.onstop = async () => {
          if (previewIntervalRef.current) clearInterval(previewIntervalRef.current);
          stream.getTracks().forEach(track => track.stop());
          
          const duration = Date.now() - recordingStartTimeRef.current;
          
          // If the recording was too short (less than 500ms), ignore it to prevent hallucinations
          if (duration < 500) {
            setInput(originalInputRef.current);
            setIsTranscribing(false);
            return;
          }

          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
          if (audioBlob.size === 0) return;
          
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64data = reader.result as string;
            if (!base64data || !base64data.includes(',')) return;
            const base64String = base64data.split(',')[1];
            if (!base64String || base64String.trim() === "") return; 
            
            setIsTranscribing(true);
            try {
              const res = await fetch("/api/transcribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  audioBase64: base64String,
                  mimeType: mediaRecorder.mimeType || "audio/webm"
                }),
              });
              
              if (res.ok) {
                const data = await res.json();
                if (data.text) {
                  const finalTxt = originalInputRef.current 
                     ? `${originalInputRef.current} ${data.text}`.trim()
                     : data.text;
                  setInput(finalTxt);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }
              } else {
                 const errText = await res.text();
                 let errData: any = {};
                 try { errData = JSON.parse(errText); } catch(e) {}
                 console.error("Transcription failed", { status: res.status, errData, raw: errText });
                 alert(`Transcription Error (${res.status}): ${errData.details || errData.error || "Unknown error"}`);
               }
            } catch (error: any) {
              console.error("Error calling transcription API:", error);
              alert(`API Call Error: ${error.message || String(error)}`);
            } finally {
              setIsTranscribing(false);
            }
          };
        };

        mediaRecorder.start(500); // CHUNK EVERY 500MS FOR LIVE STREAMING!
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
  };

  const handleMicClick = async () => {
    playClickSound();
    
    if (isRecording) {
      // Stop both recordings if they are active
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
        recognitionRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      originalInputRef.current = input; // Save the current input

      // 1. Try starting the browser's native SpeechRecognition just for UI text preview
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;

          recognition.onresult = (event: any) => {
            let currentTranscript = "";
            for (let i = 0; i < event.results.length; ++i) {
              currentTranscript += event.results[i][0].transcript;
            }
            
            const newText = originalInputRef.current 
              ? `${originalInputRef.current} ${currentTranscript}`.trim()
              : currentTranscript;
            setInput(newText); // UI preview text
          };

          recognition.onerror = (event: any) => {
            console.log("SpeechRecognition UI preview error (ignored):", event.error);
          };

          recognition.onend = () => {};

          recognitionRef.current = recognition;
          recognition.start();
        } catch (err) {
          console.error("Failed to start speech recognition for UI preview", err);
        }
      }

      // 2. Always start the MediaRecorder + Gemini API for the robust backend transcription
      await startFallbackRecording();
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <span className={styles.headerTitle}>{headerTitle}</span>

      </div>

      {/* History Area */}
      <div className={styles.history} ref={historyRef}>
        {pairs.map((pair, idx) => (
          <div key={pair.user?.id || pair.ai?.id || idx} className={styles.interactionBlock}>
            {pair.user && (
              <div className={`${styles.msgRow} ${styles.userMsgRow}`}>
                <span className={`${styles.userPrefix} ${(pair.ai?.loading || (pair.ai?.id && typingIds.has(pair.ai.id))) ? styles.activeGlyph : ""}`}>
                  {(pair.ai?.loading || (pair.ai?.id && typingIds.has(pair.ai.id))) ? <LoadingGlyph /> : ".:"}
                </span>
                <span className={styles.msgContent}>{pair.user.content}</span>
              </div>
            )}
            {pair.ai && (
              <div className={styles.msgRow}>
                <span className={`${styles.aiPrefix} ${(pair.ai.loading || (pair.ai.id && typingIds.has(pair.ai.id))) ? styles.activeGlyph : ""}`}>
                  {(pair.ai.loading || (pair.ai.id && typingIds.has(pair.ai.id))) ? <LoadingGlyph /> : "::"}
                </span>
                <span className={styles.msgContent}>
                  {pair.ai.loading ? null : (
                    <TypewriterText 
                      text={pair.ai.content} 
                      onComplete={() => handleTypewriterComplete(pair.ai?.id)} 
                    />
                  )}
                </span>
              </div>
            )}
            {/* Show suggestions only on the very last block, if AI is done typing */}
            {idx === pairs.length - 1 && pair.ai && !pair.ai.loading && (pair.ai.id && !typingIds.has(pair.ai.id)) && (
              <div className={styles.suggestionsRow}>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button 
                    key={q} 
                    className={styles.suggestionBtn}
                    onClick={() => sendMessage(q)}
                  >
                    <span className={styles.suggestionGlyph}>↳</span>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Quick Prompts inside history - Hide after first message */}
        {messages.length === 0 && (
          <div className={styles.promptsRow}>
            <button className={styles.shuffleBtn} onClick={handleShuffle} aria-label="Shuffle prompts">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                {/* Custom Pixel Shuffle Icon */}
                <path d="M7 5H17V7H19V11H17V9H9V12H7V5Z" />
                <path d="M17 19H7V17H5V13H7V15H15V12H17V19Z" />
                <path d="M18 10H20V12H18V10Z" />
                <path d="M4 12H6V14H4V12Z" />
              </svg>
            </button>
            <div className={styles.promptsContainer}>
              {activePrompts.map((prompt) => (
                <button
                  key={prompt}
                  className={styles.chip}
                  onClick={() => sendMessage(prompt)}
                >
                  <span className={styles.chipGlyph}>↳</span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className={styles.inputArea}>
        <div className={styles.inputRow}>
          <span className={styles.dragDots}>⣿</span>
          <input
            ref={inputRef}
            className={styles.inputField}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Ask about ${ownerName.split(" ")[0]}`}
            autoComplete="off"
            spellCheck={false}
          />
          {input.trim() && !isRecording && !isTranscribing ? (
            <button 
              className={styles.sendBtn} 
              onClick={() => sendMessage(input)}
              aria-label="Send message"
            >
              <Image 
                src="/logos/tools/send.svg" 
                alt="Send message" 
                width={32} 
                height={32} 
                className={styles.sendImage}
              />
            </button>
          ) : (
            <button 
              className={`${styles.micBtn} ${isRecording ? styles.micRecording : ""}`} 
              aria-label={isRecording ? "Stop Recording" : "Microphone"}
              onClick={handleMicClick}
              disabled={isTranscribing}
            >
              {isTranscribing ? (
                 <span className={styles.spinner}></span>
              ) : isRecording ? (
                 <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                   <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
                 </svg>
              ) : (
                 <Image 
                   src="/logos/tools/mic.svg" 
                   alt="Microphone" 
                   width={32} 
                   height={32} 
                   className={styles.micImage}
                 />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingGlyph() {
  const [glyph, setGlyph] = useState(".:");
  
  useEffect(() => {
    const frames = [".:", "::", ":.", "..", "·.", ":·"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % frames.length;
      setGlyph(frames[i]);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return <>{glyph}</>;
}

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  
  useEffect(() => {
    if (!text) return;
    
    let currentIdx = 0;
    setDisplayedText(""); 
    
    const intervalId = setInterval(() => {
      if (currentIdx < text.length) {
        setDisplayedText(text.slice(0, currentIdx + 1));
        currentIdx++;
      } else {
        clearInterval(intervalId);
        onCompleteRef.current?.();
      }
    }, 15);
    
    return () => clearInterval(intervalId);
  }, [text]);

  return <>{displayedText}</>;
}
