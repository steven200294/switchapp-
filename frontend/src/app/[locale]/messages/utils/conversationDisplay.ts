import { resolveStorageUrl } from "@/shared/constants/theme";
import type { ConversationListItem, ConversationThread, MatchListItem } from "../types/messages.types";

export function formatMessageTime(iso: string | null | undefined): string {
  if (!iso) return "À l'instant";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  if (diffMs < 60_000) return "À l'instant";
  if (diffMs < 86_400_000) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) {
    return d.toLocaleDateString("fr-FR", { weekday: "short" });
  }
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function conversationItemToThread(item: ConversationListItem): ConversationThread {
  const other = item.otherUser;
  return {
    id: item.id,
    name: other?.full_name ?? "Utilisateur",
    avatar: resolveStorageUrl(other?.avatar_url ?? "", "avatars"),
    lastMessage: item.last_message_text ?? "",
    time: formatMessageTime(item.last_message_at),
    unread: false,
    status: "",
  };
}

export function matchToConversationThread(match: MatchListItem): ConversationThread | null {
  const conv = match.conversation;
  if (!conv) return null;
  const other = match.otherUser;
  return {
    id: conv.id,
    name: other?.full_name ?? "Utilisateur",
    avatar: resolveStorageUrl(other?.avatar_url ?? "", "avatars"),
    lastMessage: conv.last_message_text ?? "Envoyez le premier message !",
    time: formatMessageTime(conv.last_message_at),
    unread: false,
    status: "",
  };
}
