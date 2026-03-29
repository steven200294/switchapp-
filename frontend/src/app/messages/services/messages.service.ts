import { apiFetch } from "@/shared/services/api";
import type { ConversationListItem, Message, MessagesResponse } from "../types/messages.types";

export type { ConversationListItem, Message, MessagesResponse } from "../types/messages.types";

export async function listConversations(): Promise<ConversationListItem[]> {
  return apiFetch<ConversationListItem[]>("/messages/conversations");
}

export async function getMessages(conversationId: string, page: number = 1): Promise<MessagesResponse> {
  return apiFetch<MessagesResponse>(`/messages/conversations/${conversationId}/messages?page=${page}`);
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  return apiFetch<Message>(`/messages/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
