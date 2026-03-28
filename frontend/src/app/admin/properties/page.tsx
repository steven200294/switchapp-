'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { getAdminProperties } from '@/modules/admin/services/admin.service';

export default function AdminPropertiesPage() {
  const { data: properties, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_PROPERTIES,
    queryFn: getAdminProperties,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Properties</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {(properties ?? []).length === 0 ? (
            <p className="text-gray-400 text-sm">No properties found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(properties ?? []).map((prop) => (
                <div key={prop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-1">{prop.title}</h3>
                  <p className="text-sm text-gray-500">{prop.city}</p>
                  <p className="text-sm text-gray-600 font-medium mt-1">{prop.rent} EUR/month</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">by {prop.owner_name}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      prop.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {prop.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
