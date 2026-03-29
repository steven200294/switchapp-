import type { PropertyOwner } from "@/app/explorer/types/properties.types";

interface PropertyOwnerCardProps {
  owner: PropertyOwner;
}

export default function PropertyOwnerCard({ owner }: PropertyOwnerCardProps) {
  return (
    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
      <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center shrink-0">
        {owner.avatar_url ? (
          <img src={owner.avatar_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-title font-bold text-gray-900/40">
            {(owner.full_name || "?")[0]}
          </span>
        )}
      </div>
      <div>
        <p className="text-title-sm font-bold text-gray-900">
          Proposé par {owner.full_name || "Utilisateur"}
        </p>
        {owner.profession && (
          <p className="text-body text-gray-500 font-medium">{owner.profession}</p>
        )}
        {owner.city && (
          <p className="text-body-sm text-gray-400">{owner.city}</p>
        )}
      </div>
    </div>
  );
}
