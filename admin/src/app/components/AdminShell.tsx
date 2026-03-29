"use client";

import { type ReactNode } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import AdminSidebar, { AdminMobileNav } from "@/app/components/AdminSidebar";
import LoginForm from "@/app/components/LoginForm";

export default function AdminShell({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-brand-cyan border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isLoggedIn) return <LoginForm />;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <AdminMobileNav />
      <main className="flex-1 min-w-0 md:p-8 p-4 pt-16 md:pt-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
