"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatData, ChatStep } from "./types";

function loadDraft(key: string | undefined): ChatData {
  if (!key || typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(key) ?? "{}"); } catch { return {}; }
}

interface Opts {
  steps: ChatStep[];
  storageKey?: string;
  onComplete: (data: ChatData) => void;
}

export default function useChatEngine({ steps, storageKey, onComplete }: Opts) {
  const draft = loadDraft(storageKey);
  const restoredIdx = storageKey
    ? Math.min(
        Object.keys(draft).reduce((max, key) => {
          const idx = steps.findIndex((s) => s.id === key);
          return idx > max ? idx : max;
        }, -1) + 1,
        steps.length,
      )
    : 0;

  const [data, setData] = useState<ChatData>(draft);
  const [currentIdx, setCurrentIdx] = useState(restoredIdx);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    const serializable = Object.fromEntries(
      Object.entries(data).filter(([, v]) => {
        if (v instanceof File) return false;
        if (Array.isArray(v) && v.every((x) => x instanceof File)) return false;
        return true;
      }).map(([k, v]) => {
        if (Array.isArray(v) && v.some((x) => x?.type === "file" || x?.type === "url")) {
          const cleaned = v
            .filter((x) => x?.type === "url")
            .map(({ type, url, path }: { type: string; url: string; path?: string }) => ({ type, url, path }));
          return [k, cleaned];
        }
        return [k, v];
      }),
    );
    localStorage.setItem(storageKey, JSON.stringify(serializable));
  }, [data, storageKey]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    });
  }, []);

  useEffect(() => { scrollToBottom(); }, [currentIdx, editingIdx, scrollToBottom]);

  const handleChange = useCallback((stepId: string, value: unknown) => {
    setData((prev) => ({ ...prev, [stepId]: value }));
  }, []);

  const handleSubmit = useCallback((stepIdx: number) => {
    if (editingIdx !== null) {
      setEditingIdx(null);
      return;
    }
    const nextIdx = stepIdx + 1;
    if (nextIdx < steps.length) {
      setCurrentIdx(nextIdx);
    } else {
      setCurrentIdx(nextIdx);
      onComplete(data);
    }
  }, [editingIdx, steps.length, onComplete, data]);

  const startEdit = useCallback((idx: number) => { setEditingIdx(idx); }, []);
  const cancelEdit = useCallback(() => { setEditingIdx(null); }, []);

  const clearDraft = useCallback(() => {
    if (storageKey) localStorage.removeItem(storageKey);
  }, [storageKey]);

  const reset = useCallback(() => {
    setData({});
    setCurrentIdx(0);
    setEditingIdx(null);
    if (storageKey) localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    data, currentIdx, editingIdx, scrollRef, restoredIdx,
    isComplete: currentIdx >= steps.length && editingIdx === null,
    handleChange, handleSubmit, startEdit, cancelEdit, clearDraft, reset, scrollToBottom,
  };
}
