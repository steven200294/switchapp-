"use client";

import { useState, type ReactNode } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ConnectionModal from "@/components/ConnectionModal";
import { useAuthStore } from "@/shared/stores/auth.store";

interface AuthGateProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

export default function AuthGate({ icon, title, description, children }: AuthGateProps) {
  const { isLoggedIn, isLoading } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
        <div className="hidden md:block border-b border-gray-100">
          <Header />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-500">
            {icon}
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-500 text-body-md mb-8 max-w-sm">{description}</p>
          <button
            onClick={() => setShowAuth(true)}
            className="border border-gray-300 text-gray-900 font-semibold px-8 py-3 rounded-full text-body-lg hover:bg-gray-50 transition-colors"
          >
            Se connecter
          </button>
        </main>
        <BottomNav />
        {showAuth && <ConnectionModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  return <>{children}</>;
}
