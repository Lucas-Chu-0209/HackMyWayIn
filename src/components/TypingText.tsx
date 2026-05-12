"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_TYPING_SPEED = 90;
const DEFAULT_DELETING_SPEED = 55;
const DEFAULT_PAUSE_MS = 1000;
const DEFAULT_SWITCH_DELAY_MS = 220;

interface TypingTextProps {
  sentences: string[];
  className?: string;
  cursor?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
}

export default function TypingText({
  sentences,
  className,
  cursor = "|",
  typingSpeed = DEFAULT_TYPING_SPEED,
  deletingSpeed = DEFAULT_DELETING_SPEED,
  pauseMs = DEFAULT_PAUSE_MS,
}: TypingTextProps) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || sentences.length === 0) return;

    const currentSentence = sentences[sentenceIndex] ?? "";
    let timeoutId: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < currentSentence.length) {
      timeoutId = setTimeout(() => setCharIndex((value) => value + 1), typingSpeed);
    } else if (!isDeleting && charIndex === currentSentence.length) {
      timeoutId = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && charIndex > 0) {
      timeoutId = setTimeout(() => setCharIndex((value) => value - 1), deletingSpeed);
    } else {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setSentenceIndex((value) => (value + 1) % sentences.length);
      }, DEFAULT_SWITCH_DELAY_MS);
    }

    return () => clearTimeout(timeoutId);
  }, [charIndex, deletingSpeed, isDeleting, pauseMs, prefersReducedMotion, sentenceIndex, sentences, typingSpeed]);

  const text = useMemo(() => {
    if (sentences.length === 0) return "";
    if (prefersReducedMotion) return sentences[0];
    return (sentences[sentenceIndex] ?? "").slice(0, charIndex);
  }, [charIndex, prefersReducedMotion, sentenceIndex, sentences]);

  return (
    <span className={className}>
      {text}
      <span aria-hidden className={`ml-1 inline-block ${prefersReducedMotion ? "" : "animate-pulse"}`}>
        {cursor}
      </span>
    </span>
  );
}
