import * as repo from './messages.repository.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function listConversations(userId: string) {
  const convos = await repo.findConversationsForUser(userId);

  const otherUserIds = [...new Set(
    convos.map(({ otherUserId }) => otherUserId).filter(Boolean),
  )];
  const profileMap = await repo.findUserProfilesBatch(otherUserIds);

  return convos.map(({ conversation, otherUserId }) => ({
    id: conversation.id,
    last_message_at: conversation.last_message_at,
    last_message_text: conversation.last_message_text,
    otherUser: otherUserId ? profileMap.get(otherUserId) ?? null : null,
  }));
}

export async function getMessages(conversationId: string, userId: string, page: number, limit: number) {
  const hasAccess = await repo.isUserInConversation(conversationId, userId);
  if (!hasAccess) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 403, CLIENT_MESSAGES[ERROR_CODES.FORBIDDEN]);
  }
  const [messages, total] = await Promise.all([
    repo.findMessages(conversationId, page, limit),
    repo.messageCount(conversationId),
  ]);
  return { messages, total, page, limit };
}

export async function sendMessage(conversationId: string, userId: string, content: string) {
  const hasAccess = await repo.isUserInConversation(conversationId, userId);
  if (!hasAccess) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 403, CLIENT_MESSAGES[ERROR_CODES.FORBIDDEN]);
  }
  if (!content || content.trim().length === 0) {
    throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION], 'Empty message content');
  }
  return repo.createMessage(conversationId, userId, content.trim());
}
