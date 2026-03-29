"use client";

export default function ChatInput() {
  return (
    <div className="p-3 bg-white border-t border-gray-200 shrink-0">
      <div className="flex items-center bg-gray-100 rounded-[24px] pr-2 pl-4 py-2 ring-1 ring-gray-200/50 focus-within:ring-brand-purple focus-within:bg-white transition-all">
        <button
          type="button"
          className="p-1 mr-2 text-gray-400 hover:text-brand-cyan transition-colors"
          aria-label="Ajouter"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Écrire un message..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-body-md text-gray-900 outline-none min-w-0"
        />
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple text-white flex items-center justify-center shrink-0 ml-2 shadow-sm hover:scale-105 transition-transform active:scale-95"
          aria-label="Envoyer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 ml-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
