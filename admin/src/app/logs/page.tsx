"use client";

import { useState } from "react";

const GRAFANA_URL = process.env.NEXT_PUBLIC_GRAFANA_URL || "http://localhost:3100";
const LOGS_DASHBOARD_UID = "switchappart-logs";

export default function LogsPage() {
  const [fullscreen, setFullscreen] = useState(false);

  const dashboardSrc = `${GRAFANA_URL}/d/${LOGS_DASHBOARD_UID}/switchappart-logs?orgId=1&from=now-1h&to=now&refresh=10s&kiosk=1`;

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <button
          onClick={() => setFullscreen(false)}
          className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors backdrop-blur"
        >
          Exit fullscreen
        </button>
        <iframe
          src={dashboardSrc}
          className="w-full h-full border-0"
          title="Logs"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Logs</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFullscreen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            Fullscreen
          </button>
          <a
            href={`${GRAFANA_URL}/d/${LOGS_DASHBOARD_UID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-cyan hover:underline"
          >
            Open in Grafana →
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <iframe
          src={dashboardSrc}
          className="w-full border-0"
          style={{ height: "calc(100vh - 160px)", minHeight: "600px" }}
          title="Logs"
        />
      </div>
    </div>
  );
}
