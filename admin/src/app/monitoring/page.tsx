"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getMetricsSummary } from "@/shared/services/admin.service";
import StatCard from "@/app/components/StatCard";

const GRAFANA_URL = process.env.NEXT_PUBLIC_GRAFANA_URL || "http://localhost:3100";
const DASHBOARD_UID = "switchappart-overview";

export default function MonitoringPage() {
  const [fullscreen, setFullscreen] = useState(false);

  const { data: metrics } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_METRICS_SUMMARY,
    queryFn: getMetricsSummary,
    refetchInterval: 30_000,
  });

  const grafanaSrc = `${GRAFANA_URL}/d/${DASHBOARD_UID}/switchappart-overview?orgId=1&from=now-1h&to=now&refresh=30s&kiosk=1`;

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
          src={grafanaSrc}
          className="w-full h-full border-0"
          title="Monitoring"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Monitoring</h2>
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
            href={`${GRAFANA_URL}/d/${DASHBOARD_UID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-cyan hover:underline"
          >
            Open in Grafana →
          </a>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          <StatCard label="Users" value={metrics.users.total} />
          <StatCard label="Properties" value={metrics.properties.total} />
          <StatCard label="Matches" value={metrics.matches.total} detail={`+${metrics.matches.last24h} today`} trend={metrics.matches.last24h > 0 ? "up" : "neutral"} />
          <StatCard label="Swipes" value={metrics.swipes.total} detail={`+${metrics.swipes.last24h} today`} trend={metrics.swipes.last24h > 0 ? "up" : "neutral"} />
          <StatCard label="Messages" value={metrics.messages.total} detail={`+${metrics.messages.last24h} today`} trend={metrics.messages.last24h > 0 ? "up" : "neutral"} />
          <StatCard label="Conversations" value={metrics.conversations.total} />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <iframe
          src={grafanaSrc}
          className="w-full border-0"
          style={{ height: "calc(100vh - 220px)", minHeight: "600px" }}
          title="Monitoring"
        />
      </div>
    </div>
  );
}
