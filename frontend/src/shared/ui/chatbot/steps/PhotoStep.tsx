"use client";

import { useRef, useMemo } from "react";
import type { StepComponentProps } from "../types";

export interface PhotoItem {
  type: "file" | "url";
  file?: File;
  url: string;
  path?: string;
}

function toPhotoItems(value: unknown): PhotoItem[] {
  if (!value || !Array.isArray(value)) return [];
  return (value as unknown[]).map((item) => {
    if (item instanceof File) {
      return { type: "file" as const, file: item, url: URL.createObjectURL(item) };
    }
    if (typeof item === "object" && item !== null && "type" in item) {
      return item as PhotoItem;
    }
    if (typeof item === "string") {
      return { type: "url" as const, url: item };
    }
    return null;
  }).filter(Boolean) as PhotoItem[];
}

export default function PhotoStep({ value, onChange, onSubmit, labels }: StepComponentProps) {
  const items = useMemo(() => toPhotoItems(value), [value]);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const newItems: PhotoItem[] = Array.from(files).map((f) => ({
      type: "file" as const,
      file: f,
      url: URL.createObjectURL(f),
    }));
    onChange([...items, ...newItems].slice(0, 10));
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      {items.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {items.map((item, i) => (
            <div key={i} className={`relative aspect-square rounded-xl overflow-hidden ${i === 0 ? "ring-2 ring-brand-cyan" : ""}`}>
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute bottom-0.5 left-0.5 bg-brand-dark text-white text-body-2xs font-bold px-1.5 py-0.5 rounded-full">{labels.cover}</span>}
              <button type="button" onClick={() => remove(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={10} height={10} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><g transform="translate(4,4)"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></g></svg>
              </button>
            </div>
          ))}
          {items.length < 10 && (
            <button type="button" onClick={() => inputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><g transform="translate(4,4)"><path d="M12 4v16m8-8H4" /></g></svg>
            </button>
          )}
        </div>
      )}
      {items.length === 0 && (
        <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }} className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-8 flex flex-col items-center gap-2 hover:border-brand-cyan transition-colors mb-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><g transform="translate(4,4)"><path d="M12 16v-8m-4 4l4-4 4 4M20 16.7A5 5 0 0015.5 8h-.6A8 8 0 104 15.9" /></g></svg>
          </div>
          <p className="text-body-md font-semibold text-gray-600">{labels.addPhotos}</p>
          <p className="text-body-sm text-gray-400">{items.length}/10</p>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      <button type="button" onClick={onSubmit} disabled={items.length === 0} className="w-full py-3.5 rounded-2xl bg-brand-dark text-white font-bold text-body-md disabled:opacity-30 transition-opacity">
        {labels.continue}
      </button>
    </div>
  );
}
