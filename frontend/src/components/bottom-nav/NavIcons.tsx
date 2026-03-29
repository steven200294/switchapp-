export function ExplorerIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke={isActive ? "url(#nav-gradient)" : "currentColor"} strokeWidth={isActive ? "3" : "2"} style={{ display: "block", overflow: "visible" }}>
      <g fill="none">
        <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9" />
      </g>
    </svg>
  );
}

export function FavorisIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden role="presentation" focusable="false" width="24" height="24" fill={isActive ? "url(#nav-gradient)" : "none"} stroke={isActive ? "url(#nav-gradient)" : "currentColor"} strokeWidth="2" style={{ display: "block", overflow: "visible" }}>
      <path d="M16 28c7-4.733 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.584.684-4.95 1.95L16 7.85l-2.05-1.9A6.98 6.98 0 0 0 9 4c-3.866 0-7 3.134-7 7 0 7 7 12.267 14 17z" />
    </svg>
  );
}

export function SwipeIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <rect x="2" y="6" width="14" height="14" rx="2" ry="2" />
      <path d="M6 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2" />
    </svg>
  );
}

export function MessagesIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden role="presentation" focusable="false" width="24" height="24" fill={isActive ? "url(#nav-gradient)" : "none"} stroke={isActive ? "url(#nav-gradient)" : "currentColor"} strokeWidth="2" style={{ display: "block", overflow: "visible" }}>
      <path d="M26 4H6C4.895 4 4 4.895 4 6v14c0 1.105.895 2 2 2h4v5l7-5h9c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2z" />
    </svg>
  );
}

export function ProfilIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden role="presentation" focusable="false" width="24" height="24" fill={isActive ? "url(#nav-gradient)" : "none"} stroke={isActive ? "url(#nav-gradient)" : "currentColor"} strokeWidth="2" style={{ display: "block", overflow: "visible" }}>
      <path d="M16 17c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7zm0 2c5.523 0 10 4.477 10 10V31H6v-2c0-5.523 4.477-10 10-10z" />
    </svg>
  );
}
