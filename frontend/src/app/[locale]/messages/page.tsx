"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle } from "@/shared/ui/icons";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AuthGate from "@/shared/ui/AuthGate";
import ChatWindow from "@/app/[locale]/messages/components/ChatWindow";
import MatchesCarousel from "@/app/[locale]/messages/components/MatchesCarousel";
import ConversationList from "@/app/[locale]/messages/components/ConversationList";
import EmptyChatPlaceholder from "@/app/[locale]/messages/components/EmptyChatPlaceholder";
import { useConversations } from "@/app/[locale]/messages/hooks/useMessages";
import { useMatches } from "@/app/[locale]/messages/hooks/useMatches";
import { useAuthStore } from "@/shared/stores/auth.store";
import type { ConversationThread } from "@/app/[locale]/messages/types/messages.types";
import { conversationItemToThread } from "@/app/[locale]/messages/utils/conversationDisplay";

export default function MessagesPage() {
  const t = useTranslations("messages");
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [activeChat, setActiveChat] = useState<ConversationThread | null>(null);
  const { data: conversationsData, isPending: convosPending } = useConversations(isLoggedIn);
  const { data: matchesData, isPending: matchesPending } = useMatches(isLoggedIn);

  const conversationThreads = useMemo(
    () => (conversationsData ?? []).map(conversationItemToThread),
    [conversationsData],
  );

  const newMatches = useMemo(() => {
    const all = matchesData ?? [];
    return all.filter((m) => m.conversation);
  }, [matchesData]);

  return (
    <AuthGate
      icon={<MessageCircle className="w-10 h-10 text-white" />}
      title={t("authTitle")}
      description={t("authDescription")}
    >
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        <div className="hidden md:block border-b border-gray-100 shrink-0">
          <Header />
        </div>

        <main className="flex-1 w-full max-w-[1400px] mx-auto flex md:p-6 gap-6 overflow-hidden relative md:pt-[180px]">
          <div
            className={`w-full md:w-[400px] lg:w-[450px] shrink-0 h-full overflow-y-auto scrollbar-hide flex-col pb-[90px] md:pb-0 ${
              activeChat ? "hidden md:flex" : "flex"
            } md:border md:border-gray-100 md:bg-white md:rounded-3xl md:shadow-sm`}
          >
            <div className="px-6 pt-10 md:pt-8 md:px-8 pb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-transparent">
              <h1 className="text-display md:text-display-sm font-bold text-gray-900 tracking-tight">
                {t("title")}
              </h1>
            </div>

            <div className="px-6 md:px-8 py-4">
              <MatchesCarousel
                matches={newMatches}
                onSelectMatch={setActiveChat}
                isLoading={matchesPending}
              />
              <ConversationList
                conversations={conversationThreads}
                activeChat={activeChat}
                onSelect={setActiveChat}
                isLoading={convosPending}
              />
            </div>
          </div>

          <div className="hidden md:flex flex-1 h-full bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden relative">
            {activeChat ? (
              <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} isMobile={false} />
            ) : (
              <EmptyChatPlaceholder />
            )}
          </div>
        </main>

        <div className="md:hidden">
          <BottomNav />
        </div>
        {activeChat && (
          <div className="md:hidden">
            <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} isMobile={true} />
          </div>
        )}
      </div>
    </AuthGate>
  );
}
