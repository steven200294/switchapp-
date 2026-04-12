import { useTranslations } from "next-intl";

const EMOJI_URL = "/emojis/woman.png";

interface AuthFormHeaderProps {
  activeTab: "signin" | "signup";
}

export default function AuthFormHeader({ activeTab }: AuthFormHeaderProps) {
  const t = useTranslations("auth");

  return (
    <div className="text-center mb-6">
      <h2 className="text-display-sm font-bold text-gray-900 mb-1">
        {activeTab === "signin" ? t("loginTitle") : t("registerTitle")}
      </h2>
      <p className="text-body text-gray-400">
        {activeTab === "signin" ? t("loginSubtitle") : t("registerSubtitle")}
      </p>
      <img
        src={EMOJI_URL}
        alt=""
        width={120}
        height={120}
        className="mx-auto mt-2"
      />
    </div>
  );
}
