export default function SocialLoginButtons() {
  return (
    <>
      <div className="flex items-center w-full mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-4 text-[13px] text-gray-400 font-medium">Ou continuer avec</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex items-center justify-center space-x-5 mb-8">
        <button type="button" className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm" aria-label="Google">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        </button>
        <button type="button" className="w-14 h-14 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-900 transition-colors shadow-sm" aria-label="Apple">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16 14.4c0-2.4 1.9-3.5 1.9-3.5-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3.1-2.5.8-3.2 2-1.3 2.3-.3 5.7 1 7.6.6.9 1.4 1.9 2.4 1.9 1 0 1.4-.6 2.5-.6 1.1 0 1.5.6 2.5.6 1 0 1.7-1 2.3-1.9.8-1.1 1.1-2.3 1.1-2.4 0-.1-2.1-.8-2.1-3.2zM14.6 10c.5-.7.9-1.6.8-2.5-.8 0-1.8.4-2.4 1-.5.5-.9 1.4-.8 2.3.9.1 1.8-.4 2.4-1z" />
          </svg>
        </button>
        <button type="button" className="w-14 h-14 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5] transition-colors shadow-sm" aria-label="Facebook">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
      </div>
    </>
  );
}
