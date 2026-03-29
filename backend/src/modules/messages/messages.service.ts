import * as repo from './messages.repository.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function listConversations(userId: string) {
  const convos = await repo.findConversationsForUser(userId);

  return Promise.all(
    convos.map(async ({ conversation, otherUserId }) => {
      const otherUser = otherUserId ? await repo.findUserProfile(otherUserId) : null;
      return {
        id: conversation.id,
        last_message_at: conversation.last_message_at,
        last_message_text: conversation.last_message_text,
        otherUser,
      };
    }),
  );
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
    throw new AppError(ERROR_CODES.VALIDATION, 400, 'Message content is required');
  }
  return repo.createMessage(conversationId, userId, content.trim());
}
