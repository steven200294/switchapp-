import { apiFetch } from '@/shared/services/api';

export interface ConversationListItem {
  id: string;
  last_message_at: string | null;
  last_message_text: string | null;
  otherUser: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  created_at: string;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
}

export async function listConversations(): Promise<ConversationListItem[]> {
  return apiFetch<ConversationListItem[]>('/messages/conversations');
}

export async function getMessages(conversationId: string, page: number = 1): Promise<MessagesResponse> {
  return apiFetch<MessagesResponse>(`/messages/conversations/${conversationId}/messages?page=${page}`);
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  return apiFetch<Message>(`/messages/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}
