"use client";

interface ChatHeaderProps {
  name: string;
  avatar: string;
  onBack: () => void;
  onMenuOpen: () => void;
  isMobile: boolean;
}

export default function ChatHeader({ name, avatar, onBack, onMenuOpen, isMobile }: ChatHeaderProps) {
  return (
    <header className="px-4 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className={`p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 ${
            !isMobile ? "md:hidden" : ""
          }`}
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm relative">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-brand-cyan rounded-full border-2 border-white" />
          </div>
          <h2 className="text-body-lg font-bold text-gray-900 tracking-tight">{name}</h2>
        </div>
      </div>
      <button
        type="button"
        onClick={onMenuOpen}
        className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-500"
        aria-label="Menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>
    </header>
  );
}
