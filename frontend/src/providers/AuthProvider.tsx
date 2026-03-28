"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return <>{children}</>;
}
