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

/** UI model for list row + active chat (conversation id = `id`). */
export interface ConversationThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  status: string;
}

export interface MatchListItem {
  id: string;
  created_at: string;
  otherUser: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
  } | null;
  conversation: {
    id: string;
    last_message_at: string | null;
    last_message_text: string | null;
  } | null;
}
