"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getAdminProperties, type AdminProperty } from "@/shared/services/admin.service";
import { resolveStorageUrl } from "@/shared/constants/theme";

function PropertyCover({ prop }: { prop: AdminProperty }) {
  const raw = prop.cover_image || prop.cover_path || prop.photos?.[0] || null;
  const src = raw ? resolveStorageUrl(raw) : null;
  if (src) return <img src={src} alt="" className="w-full h-36 object-cover" />;
  return <div className="w-full h-36 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-300 text-4xl">🏠</div>;
}

export default function PropertiesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_PROPERTIES, page],
    queryFn: () => getAdminProperties(page),
  });

  const properties = data?.properties ?? [];
  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Properties <span className="text-gray-400 font-normal text-lg">({data?.total ?? 0})</span>
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-36 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <p className="text-gray-400 text-sm">No properties.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => router.push(`/users/${prop.owner_id}`)}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <PropertyCover prop={prop} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{prop.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                      prop.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {prop.published ? "live" : "draft"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{prop.city ?? "—"}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                    <span>
                      {[prop.rooms && `${prop.rooms} rooms`, prop.surface_area && `${prop.surface_area}m²`].filter(Boolean).join(" · ")}
                    </span>
                    {prop.monthly_rent ? <span className="font-semibold text-gray-700">{prop.monthly_rent} €/m</span> : null}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-linear-to-r from-brand-cyan to-brand-purple flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {(prop.owner_full_name ?? prop.owner_email ?? "?")[0].toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-500 truncate">
                      {prop.owner_full_name ?? prop.owner_email ?? prop.owner_id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30">Prev</button>
              <span className="text-xs text-gray-500">{page} / {totalPages}</span>
              <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-30">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
