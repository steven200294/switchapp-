"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ChatBot } from "@/shared/ui/chatbot";
import type { ChatData, ChatLabels } from "@/shared/ui/chatbot";
import { getCoreSteps } from "./coreSteps";
import { getDetailSteps } from "./detailSteps";
import { usePublishFromChat, useSaveDraft } from "../hooks/usePropertyMutations";

const DRAFT_KEY = "switchapp_listing_draft";
type Phase = "core" | "details";

interface Props {
  onClose: () => void;
}

export default function PropertyChatBot({ onClose }: Props) {
  const t = useTranslations("chatbot");
  const [phase, setPhase] = useState<Phase>("core");
  const [detailsKey, setDetailsKey] = useState(0);
  const [coreData, setCoreData] = useState<ChatData>({});

  const publish = usePublishFromChat(onClose);
  const draft = useSaveDraft(onClose);
  const saving = publish.isPending || draft.isPending;
  const error = publish.error?.message ?? draft.error?.message ?? null;

  const labels: ChatLabels = useMemo(() => ({
    continue: t("continueBtn"),
    confirm: t("confirmBtn"),
    edit: t("editBtn"),
    addPhotos: t("addPhotos"),
    cover: t("coverLabel"),
    restart: t("restart"),
  }), [t]);

  const coreSteps = useMemo(() => getCoreSteps(t), [t]);
  const detailSteps = useMemo(() => getDetailSteps(t), [t]);

  const handleCoreComplete = useCallback((data: ChatData) => {
    setCoreData(data);
  }, []);

  const handleCoreAction = useCallback(
    (actionId: string, data: ChatData) => {
      setCoreData(data);
      if (actionId === "publish") publish.mutate(data);
      else if (actionId === "details") {
        localStorage.removeItem(`${DRAFT_KEY}_details`);
        setDetailsKey((k) => k + 1);
        setPhase("details");
      }
      else if (actionId === "draft") draft.mutate(data);
    },
    [publish, draft],
  );

  const handleDetailAction = useCallback(
    (actionId: string, data: ChatData) => {
      const merged = { ...coreData, ...data };
      if (actionId === "publish") publish.mutate(merged);
      else if (actionId === "draft") draft.mutate(merged);
    },
    [coreData, publish, draft],
  );

  const overlay = (saving || error) && (
    <div className="fixed inset-x-0 bottom-0 z-110 px-4 pb-6 pointer-events-none">
      {saving && (
        <div className="bg-brand-dark text-white rounded-2xl px-5 py-3 text-body-md font-medium text-center shadow-lg animate-chat-slide-up pointer-events-auto">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t("saving")}
          </div>
        </div>
      )}
      {error && (
        <button
          type="button"
          onClick={() => { publish.reset(); draft.reset(); }}
          className="w-full bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-3 text-body-md font-medium text-center shadow-lg pointer-events-auto"
        >
          {error}
        </button>
      )}
    </div>
  );

  if (phase === "details") {
    return (
      <>
        <ChatBot
          key={detailsKey}
          steps={detailSteps}
          onComplete={() => {}}
          onAction={handleDetailAction}
          onClose={onClose}
          introMessage={t("detailsIntro")}
          storageKey={`${DRAFT_KEY}_details`}
          labels={labels}
        />
        {overlay}
      </>
    );
  }

  return (
    <>
      <ChatBot
        steps={coreSteps}
        onComplete={handleCoreComplete}
        onAction={handleCoreAction}
        onClose={onClose}
        introMessage={t("intro")}
        storageKey={DRAFT_KEY}
        labels={labels}
      />
      {overlay}
    </>
  );
}
