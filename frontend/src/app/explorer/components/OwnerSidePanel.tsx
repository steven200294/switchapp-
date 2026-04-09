import UserAvatar from "@/shared/ui/UserAvatar";
import type { PropertyOwner } from "@/app/explorer/types/properties.types";

interface OwnerSidePanelProps {
  owner: PropertyOwner;
}

export default function OwnerSidePanel({ owner }: OwnerSidePanelProps) {
  return (
    <div className="hidden md:flex flex-col w-72 shrink-0 bg-white rounded-2xl shadow-2xl self-start sticky top-6 overflow-hidden">
      <div className="h-20 bg-linear-to-br from-brand-cyan/20 to-brand-purple/20" />
      <div className="flex flex-col items-center px-6 pb-6 -mt-10">
        <div className="ring-4 ring-white rounded-full shadow-md mb-3">
          <UserAvatar avatarUrl={owner.avatar_url} name={owner.full_name} size="xl" />
        </div>
        <h3 className="text-title-sm font-black text-gray-900 text-center">
          {owner.full_name || "Utilisateur"}
        </h3>
        {owner.profession && (
          <p className="text-body-sm text-gray-500 font-medium mt-0.5 text-center">{owner.profession}</p>
        )}
        {owner.city && (
          <p className="text-body-sm text-gray-400 mt-0.5 text-center flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {owner.city}
          </p>
        )}

        {owner.verified && (
          <div className="mt-3 flex items-center gap-1.5 bg-green-50 text-green-700 text-body-sm font-semibold px-3 py-1.5 rounded-full">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Identité vérifiée
          </div>
        )}

        <div className="w-full h-px bg-gray-100 my-5" />

        <div className="w-full bg-gray-50 rounded-2xl p-4 mb-5 text-center">
          <p className="text-display-xs font-black text-gray-900">12</p>
          <p className="text-body-sm text-gray-400 font-medium mt-0.5">personnes ont proposé un Switch</p>
        </div>

        <button
          type="button"
          className="w-full py-3.5 bg-black text-white font-bold text-body-md rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Chater
        </button>
      </div>
    </div>
  );
}
