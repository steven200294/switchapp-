"use client";

import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useAuthStore } from "@/shared/stores/auth.store";
import { getMe } from "@/shared/auth/services/auth.service";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const hydrateToken = useAuthStore((s) => s.hydrateToken);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    hydrateToken();
  }, [hydrateToken]);

  const { data, isError, isSuccess } = useQuery({
    queryKey: QUERY_KEYS.AUTH_ME,
    queryFn: getMe,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isSuccess && data?.user) {
      setUser(data.user);
    }
    if (isError) {
      logout();
    }
  }, [isSuccess, isError, data, setUser, logout]);

  useEffect(() => {
    if (token === null) {
      useAuthStore.setState({ isLoading: false });
    }
  }, [token]);

  return <>{children}</>;
}
