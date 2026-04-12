"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import type { ListingDraft } from "../page";

interface Props { draft: ListingDraft; update: (d: Partial<ListingDraft>) => void; onNext: () => void; onPrev: () => void; }

export default function StepPhotos({ draft, update, onNext }: Props) {
  const t = useTranslations("listing");
  const tCommon = useTranslations("common");
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = draft.photos.map((f) => URL.createObjectURL(f));

  function handleFiles(files: FileList | null) {
    if (!files) return;
    update({ photos: [...draft.photos, ...Array.from(files)].slice(0, 10) });
  }

  function remove(i: number) {
    update({ photos: draft.photos.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-display-sm font-black text-gray-900 mb-2">{t("photosTitle")}</h2>
      <p className="text-body-md text-gray-400 mb-8">{t("photosSubtitle")}</p>

      {/* Upload zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        aria-label={t("photosUploadCta")}
        className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-10 flex flex-col items-center gap-3 hover:border-black hover:bg-gray-50 transition-all mb-6 cursor-pointer"
      >
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m-4 4l4-4 4 4M20 16.7A5 5 0 0015.5 8h-.6A8 8 0 104 15.9" />
          </svg>
        </div>
        <p className="text-body-md font-bold text-gray-700">{t("photosUploadCta")}</p>
        <p className="text-body-sm text-gray-400">{t("photosHint")}</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </button>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {previews.map((src, i) => (
            <div key={i} className={`relative aspect-square rounded-xl overflow-hidden ${i === 0 ? "ring-2 ring-black" : ""}`}>
              <img src={src} alt="" className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute bottom-1 left-1 bg-black text-white text-body-2xs font-bold px-2 py-0.5 rounded-full">{t("photosCover")}</span>}
              <button type="button" onClick={() => remove(i)} aria-label={tCommon("delete")} className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={onNext} disabled={draft.photos.length === 0} className="w-full py-4 rounded-2xl bg-black text-white font-bold text-body-md hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        {tCommon("next")}
      </button>
    </div>
  );
}
