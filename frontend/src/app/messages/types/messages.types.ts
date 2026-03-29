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

export interface MockMatch {
  id: number;
  name: string;
  avatar: string;
  city: string;
}

export interface MockConversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  status: string;
}
