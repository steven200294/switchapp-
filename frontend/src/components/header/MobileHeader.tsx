import { useTranslations } from "next-intl";
import { Search } from "@/shared/ui/icons";

type Props = {
  activeTab: "logements" | "utilisateurs";
  setActiveTab: (t: "logements" | "utilisateurs") => void;
  onSearchClick?: () => void;
};

export default function MobileHeader({ activeTab, setActiveTab, onSearchClick }: Props) {
  const t = useTranslations("search");
  const tNav = useTranslations("nav");

  const tabCls = (on: boolean) =>
    `text-body transition-colors pb-3 border-b-2 ${
      on
        ? "font-semibold text-gray-900 border-black"
        : "font-medium text-gray-500 hover:text-gray-900 border-transparent"
    }`;

  return (
    <div className="block md:hidden px-4 pt-4 pb-0 bg-white shadow-sm">
      <button
        type="button"
        onClick={onSearchClick}
        className="w-full h-14 bg-white border border-gray-300 shadow-md rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
      >
        <Search className="w-4 h-4 text-gray-900" />
        <span className="text-body-md font-semibold text-gray-900 tracking-wide">{t("startSearch")}</span>
      </button>

      <div className="flex justify-center gap-10 mt-6 relative z-10">
        <button type="button" onClick={() => setActiveTab("logements")} className={tabCls(activeTab === "logements")}>
          {tNav("properties")}
        </button>
        <button type="button" onClick={() => setActiveTab("utilisateurs")} className={tabCls(activeTab === "utilisateurs")}>
          {tNav("filters")}
        </button>
      </div>
    </div>
  );
}
