"use client";

import { useEffect } from "react";

export default function AdminRedirect() {
  useEffect(() => {
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002";
    window.location.href = adminUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to admin panel…</p>
    </div>
  );
}
