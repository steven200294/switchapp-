"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  text: string;
  speed?: number;
  onDone?: () => void;
}

export default function TypingText({ text, speed = 25, onDone }: Props) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    idx.current = 0;
    done.current = false;
    setDisplayed("");

    const interval = setInterval(() => {
      idx.current++;
      if (idx.current >= text.length) {
        setDisplayed(text);
        clearInterval(interval);
        if (!done.current) { done.current = true; onDone?.(); }
        return;
      }
      setDisplayed(text.slice(0, idx.current));
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onDone]);

  return (
    <>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-text-bottom" />
      )}
    </>
  );
}
