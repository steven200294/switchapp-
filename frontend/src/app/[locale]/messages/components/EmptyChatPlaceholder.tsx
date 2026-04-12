"use client";

import { useTranslations } from "next-intl";
import { ChatBubbleDots } from "@/shared/ui/icons";

export default function EmptyChatPlaceholder() {
  const t = useTranslations("messages");
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <ChatBubbleDots className="w-10 h-10 text-gray-400" strokeWidth={1} />
      </div>
      <h2 className="text-title font-bold text-gray-900 mb-2 tracking-tight">{t("yourMessages")}</h2>
      <p className="text-gray-500 font-medium text-body text-center max-w-sm px-4">
        {t("selectConversation")}
      </p>
    </div>
  );
}
