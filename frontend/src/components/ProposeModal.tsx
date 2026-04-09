"use client";

import { useRouter } from "next/navigation";
import { X } from "@/shared/ui/icons";

export default function ProposeModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[540] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full z-10 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative h-52 w-full overflow-hidden">
          <img
            src="/propose-apartment.jpg"
            alt="Appartement"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        </div>

        <div className="flex flex-col items-center px-8 pt-6 pb-8">
          <h2 className="text-display-xs font-black text-gray-900 text-center mb-2">
            Proposez votre logement
          </h2>
          <p className="text-body-lg text-gray-500 text-center leading-relaxed mb-8">
            Mettez votre appartement à disposition et trouvez votre Switch idéal.
          </p>
          <button
            type="button"
            onClick={() => { onClose(); router.push("/profil/hote"); }}
            className="w-full py-4 bg-black text-white font-bold text-body-lg rounded-2xl hover:bg-gray-800 transition-colors mb-3"
          >
            Proposer mon logement
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 text-gray-500 font-medium text-body hover:text-gray-700 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
