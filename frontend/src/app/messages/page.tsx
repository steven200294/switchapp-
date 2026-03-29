"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "@/shared/ui/icons";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AuthGate from "@/shared/ui/AuthGate";
import ChatWindow from "@/app/messages/components/ChatWindow";
import MatchesCarousel from "@/app/messages/components/MatchesCarousel";
import ConversationList from "@/app/messages/components/ConversationList";
import EmptyChatPlaceholder from "@/app/messages/components/EmptyChatPlaceholder";
import { useConversations } from "@/app/messages/hooks/useMessages";
import { useMatches } from "@/app/messages/hooks/useMatches";
import type { ConversationThread } from "@/app/messages/types/messages.types";
import { conversationItemToThread } from "@/app/messages/utils/conversationDisplay";

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<ConversationThread | null>(null);
  const { data: conversationsData, isPending: convosPending } = useConversations(true);
  const { data: matchesData, isPending: matchesPending } = useMatches(true);

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
      title="Vos messages"
      description="Connectez-vous pour voir vos conversations et échanger avec vos matchs."
    >
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        <div className="hidden md:block border-b border-gray-100 shrink-0">
          <Header />
        </div>

        <main className="flex-1 w-full max-w-[1400px] mx-auto flex md:p-6 gap-6 overflow-hidden relative">
          <div
            className={`w-full md:w-[400px] lg:w-[450px] shrink-0 h-full overflow-y-auto scrollbar-hide flex-col pb-[90px] md:pb-0 ${
              activeChat ? "hidden md:flex" : "flex"
            } md:border md:border-gray-100 md:bg-white md:rounded-3xl md:shadow-sm`}
          >
            <div className="px-6 pt-10 md:pt-8 md:px-8 pb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-transparent">
              <h1 className="text-display md:text-display-sm font-bold text-gray-900 tracking-tight">
                Messages
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
