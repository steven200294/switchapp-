import { useTranslations } from "next-intl";
import { Search } from "@/shared/ui/icons";
import { useSearchStore } from "@/shared/stores/search.store";

export default function DesktopSearchBar({ onSearchClick }: { onSearchClick?: () => void }) {
  const t = useTranslations("search");
  const openSearch = useSearchStore((s) => s.open);
  const handleClick = onSearchClick ?? openSearch;

  return (
    <div className="max-w-[700px] mx-auto pb-6 px-6 hidden md:block" onClick={handleClick}>
      <div className="bg-white border border-gray-200 rounded-full shadow-md flex items-center h-16 relative overflow-hidden cursor-pointer">
        <div className="flex-1 h-full rounded-full hover:bg-gray-100 flex flex-col justify-center px-8 cursor-pointer transition-colors focus-within:bg-white focus-within:shadow-lg">
          <label htmlFor="ville-search" className="text-caption font-bold text-black tracking-wide cursor-pointer mb-0.5">
            {t("city")}
          </label>
          <input
            id="ville-search"
            type="text"
            placeholder={t("searchDestination")}
            className="w-full bg-transparent outline-none text-body text-gray-900 placeholder-gray-500 font-medium truncate"
          />
        </div>

        <div className="w-px h-8 bg-gray-300 pointer-events-none" />

        <div className="flex-1 h-full rounded-full hover:bg-gray-100 flex flex-col justify-center pl-8 pr-2 cursor-pointer transition-colors focus-within:bg-white focus-within:shadow-lg">
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex-1 flex flex-col justify-center">
              <label htmlFor="user-search" className="text-caption font-bold text-black tracking-wide cursor-pointer mb-0.5">
                {t("userLabel")}
              </label>
              <input
                id="user-search"
                type="text"
                placeholder={t("searchProfile")}
                className="w-full bg-transparent outline-none text-body text-gray-900 placeholder-gray-500 font-medium truncate"
              />
            </div>

            <button
              type="button"
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white shrink-0 hover:bg-gray-800 transition-colors"
              aria-label={t("searchButton")}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
