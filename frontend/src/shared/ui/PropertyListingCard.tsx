"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MapPin, Maximize, Bed, Heart } from "@/shared/ui/icons";
import { FavoriteHeart } from "@/shared/ui/icons";
import { resolveStorageUrl, pickCover } from "@/shared/constants/theme";
import PropertyImage from "@/shared/ui/PropertyImage";

export interface ListingCardProperty {
  id: string;
  title: string;
  city: string | null;
  district?: string | null;
  surface_area: number | null;
  rooms: number | null;
  monthly_rent: number | null;
  cover_image: string | null;
  photos: string[];
  cover_path?: string | null;
  photo_paths?: string[];
}

interface BaseProps {
  property: ListingCardProperty;
  variant?: "grid" | "compact";
}

interface FavoriteProps extends BaseProps {
  mode: "favorite";
  onRemove: () => void;
  onOpen?: never;
  isFavorited?: never;
  onToggleFavorite?: never;
}

interface BrowseProps extends BaseProps {
  mode?: "browse";
  onOpen?: (id: string) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  onRemove?: never;
}

type Props = FavoriteProps | BrowseProps;

export default function PropertyListingCard(props: Props) {
  const { property: p, variant = "grid", mode = "browse" } = props;
  const t = useTranslations("common");
  const coverImg = resolveStorageUrl(pickCover(p));

  const isCompact = variant === "compact";

  const image = (
    <div className={`relative ${isCompact ? "aspect-4/3" : "aspect-4/3"} rounded-2xl overflow-hidden ${isCompact ? "mb-2.5" : "mb-3"}`}>
      <PropertyImage
        src={coverImg}
        alt={p.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {p.monthly_rent != null && p.monthly_rent > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
          <span className={`font-black text-gray-900 ${isCompact ? "text-body-sm" : "text-body"}`}>
            {p.monthly_rent}{t("currency")}
          </span>
          <span className={`text-gray-500 font-medium ${isCompact ? "text-body-2xs" : "text-caption"}`}>{t("perMonth")}</span>
        </div>
      )}

      {"onRemove" in props && props.onRemove && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); props.onRemove(); }}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors"
        >
          <Heart className="w-4.5 h-4.5 text-red-500 fill-red-500" />
        </button>
      )}

      {"onToggleFavorite" in props && props.onToggleFavorite && (
        <button
          type="button"
          className="absolute top-3 right-3 transition-transform active:scale-95"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); props.onToggleFavorite!(p.id); }}
        >
          <FavoriteHeart
            size={24}
            style={{
              fill: props.isFavorited ? "var(--brand-cyan)" : "rgba(0,0,0,0.5)",
              stroke: props.isFavorited ? "var(--brand-cyan)" : "white",
              strokeWidth: "2",
            }}
          />
        </button>
      )}
    </div>
  );

  const info = (
    <div className={isCompact ? "" : "px-1"}>
      <div className="flex items-center gap-1.5 mb-1">
        <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
        <span className={`font-bold text-gray-900 truncate ${isCompact ? "text-body-sm" : "text-body-sm"}`}>
          {p.city}{p.district ? `, ${p.district}` : ""}
        </span>
      </div>
      <h3 className={`font-semibold text-gray-800 leading-snug mb-1 line-clamp-1 ${isCompact ? "text-body" : "text-body-md"}`}>
        {p.title}
      </h3>
      <div className={`flex items-center gap-3 text-gray-500 font-medium ${isCompact ? "text-body-xs" : "text-body-sm"}`}>
        {p.surface_area != null && p.surface_area > 0 && (
          <span className="flex items-center gap-1">
            <Maximize className="w-3.5 h-3.5" />
            {p.surface_area}{t("sqm")}
          </span>
        )}
        {p.rooms != null && p.rooms > 0 && (
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5" />
            {p.rooms} {t("roomsAbbrev")}
          </span>
        )}
      </div>
    </div>
  );

  const wrapperClass = isCompact
    ? "group relative shrink-0 w-[240px] md:w-[270px] snap-start"
    : "group relative";

  if (mode === "favorite") {
    return (
      <div className={wrapperClass}>
        <Link href={`/explorer/${p.id}`} className="block">
          {image}
          {info}
        </Link>
      </div>
    );
  }

  const onOpen = "onOpen" in props ? props.onOpen : undefined;

  return (
    <div className={`${wrapperClass} cursor-pointer`} onClick={() => onOpen?.(p.id)}>
      {image}
      {info}
    </div>
  );
}
