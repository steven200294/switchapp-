"use client";

import { useEffect, useState } from "react";
import ConnectionModal from "./ConnectionModal";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[110] backdrop-blur-sm bg-black/20" />
      )}
      <footer className="relative z-[120] w-full bg-white border-t border-gray-100 px-6 py-4">
        {isOpen && <ConnectionModal onClose={() => setIsOpen(false)} />}
      </footer>
    </>
  );
}
