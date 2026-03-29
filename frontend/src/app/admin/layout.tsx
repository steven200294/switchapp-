"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth.store";
import AdminSidebar, { AdminMobileNav } from "@/app/admin/components/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push("/");
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-cyan border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

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
