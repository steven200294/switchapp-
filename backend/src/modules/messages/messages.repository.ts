import prisma from '../../infra/prisma/client.js';

export async function findUserProfile(userId: string) {
  return prisma.userProfile.findUnique({
    where: { user_id: userId },
    select: { user_id: true, full_name: true, avatar_url: true },
  });
}

export async function findUserProfilesBatch(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, { user_id: string; full_name: string | null; avatar_url: string | null }>();
  const profiles = await prisma.userProfile.findMany({
    where: { user_id: { in: userIds } },
    select: { user_id: true, full_name: true, avatar_url: true },
  });
  return new Map(profiles.map((p) => [p.user_id, p]));
}

export async function findConversationsForUser(userId: string) {
  const participations = await prisma.conversationParticipant.findMany({
    where: { user_id: userId },
    select: { conversation_id: true },
  });

  const conversationIds = participations.map(p => p.conversation_id);
  if (conversationIds.length === 0) return [];

  const conversations = await prisma.conversation.findMany({
    where: { id: { in: conversationIds } },
    include: {
      participants: { select: { user_id: true } },
    },
    orderBy: { last_message_at: { sort: 'desc', nulls: 'last' } },
  });

  return conversations.map(c => ({
    conversation: c,
    otherUserId: c.participants.find(p => p.user_id !== userId)?.user_id ?? '',
  }));
}

export async function isUserInConversation(conversationId: string, userId: string): Promise<boolean> {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversation_id_user_id: { conversation_id: conversationId, user_id: userId } },
  });
  return !!participant;
}

export async function findMessages(conversationId: string, page: number, limit: number) {
  return prisma.message.findMany({
    where: { conversation_id: conversationId },
    orderBy: { created_at: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });
}

export async function messageCount(conversationId: string): Promise<number> {
  return prisma.message.count({ where: { conversation_id: conversationId } });
}

export async function createMessage(conversationId: string, senderId: string, content: string) {
  const message = await prisma.message.create({
    data: { conversation_id: conversationId, sender_id: senderId, content },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { last_message_at: new Date(), last_message_text: content },
  });

  return message;
}
