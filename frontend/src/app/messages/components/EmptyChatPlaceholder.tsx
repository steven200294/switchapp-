"use client";

export default function EmptyChatPlaceholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="w-10 h-10 text-gray-400"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h2 className="text-title font-bold text-gray-900 mb-2 tracking-tight">Vos messages</h2>
      <p className="text-gray-500 font-medium text-body text-center max-w-sm px-4">
        Sélectionnez une conversation pour échanger sur vos futurs Switch !
      </p>
    </div>
  );
}
