import prisma from '../../infra/prisma/client.js';

export async function findByUserId(userId: string) {
  return prisma.match.findMany({
    where: {
      OR: [{ user_a: userId }, { user_b: userId }],
    },
    include: {
      conversations: {
        select: { id: true, last_message_at: true, last_message_text: true },
        take: 1,
      },
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function findById(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      conversations: {
        select: { id: true, last_message_at: true },
        take: 1,
      },
    },
  });
}
