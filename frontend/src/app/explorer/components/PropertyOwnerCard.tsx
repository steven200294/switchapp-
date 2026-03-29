import UserAvatar from "@/shared/ui/UserAvatar";
import type { PropertyOwner } from "@/app/explorer/types/properties.types";

interface PropertyOwnerCardProps {
  owner: PropertyOwner;
}

export default function PropertyOwnerCard({ owner }: PropertyOwnerCardProps) {
  return (
    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
      <UserAvatar avatarUrl={owner.avatar_url} name={owner.full_name} size="xl" className="shadow-sm" />
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
