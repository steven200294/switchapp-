import prisma from '../../infra/prisma/client.js';

export type AdminUserRow = {
  user_id: string;
  email: string;
  email_confirmed: boolean;
  last_sign_in_at: string | null;
  created_at: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  city: string | null;
  phone: string | null;
  bio: string | null;
  profession: string | null;
  verified: boolean;
};

export type AdminPropertyRow = {
  id: string;
  owner_id: string;
  owner_full_name: string | null;
  owner_email: string | null;
  title: string;
  city: string | null;
  monthly_rent: number | null;
  surface_area: number | null;
  rooms: number | null;
  bedrooms: number | null;
  published: boolean;
  photos: string[];
  cover_image: string | null;
  cover_path: string | null;
  created_at: string | null;
};

export type AdminMatchRow = {
  id: string;
  user_a: string;
  user_b: string;
  property_a: string;
  property_b: string;
  created_at: string;
  user_a_name: string | null;
  user_b_name: string | null;
  property_a_title: string | null;
  property_b_title: string | null;
};

export type AdminSwipeRow = {
  id: string;
  user_id: string;
  property_id: string;
  action: string;
  created_at: string;
  user_name: string | null;
  property_title: string | null;
};

export type AdminConversationRow = {
  id: string;
  match_id: string | null;
  created_at: string;
  last_message_at: string | null;
  last_message_text: string | null;
  message_count: number;
  participant_names: string | null;
};

export type AdminMessageRow = {
  id: string;
  sender_id: string;
  sender_name: string | null;
  content: string | null;
  created_at: string;
};

export async function getDashboardStats(): Promise<{
  userCount: number;
  propertyCount: number;
  verifiedEmailCount: number;
  withAvatarCount: number;
  withPropertyCount: number;
}> {
  const [userCount, propertyCount, verifiedEmailCount, withAvatarCount, withPropertyCount] =
    await Promise.all([
      prisma.authUser.count(),
      prisma.property.count(),
      prisma.authUser.count({ where: { email_confirmed_at: { not: null } } }),
      prisma.userProfile.count({ where: { avatar_url: { not: '' } } }),
      prisma.$queryRaw<[{ cnt: bigint }]>`
        SELECT COUNT(DISTINCT owner_id)::bigint as cnt FROM public.properties
      `.then((r) => Number(r[0].cnt)),
    ]);

  return { userCount, propertyCount, verifiedEmailCount, withAvatarCount, withPropertyCount };
}

export async function listUsers(
  page: number,
  limit: number,
): Promise<{ users: AdminUserRow[]; total: number }> {
  const offset = (page - 1) * limit;

  const [rows, countResult] = await Promise.all([
    prisma.$queryRaw<AdminUserRow[]>`
      SELECT
        up.user_id,
        COALESCE(au.email, up.email) AS email,
        (au.email_confirmed_at IS NOT NULL) AS email_confirmed,
        au.last_sign_in_at::text,
        up.created_at::text,
        up.full_name,
        up.first_name,
        up.last_name,
        up.avatar_url,
        up.city,
        up.phone,
        up.bio,
        up.profession,
        COALESCE(up.verified, false) AS verified
      FROM public.user_profiles up
      LEFT JOIN auth.users au ON au.id = up.user_id
      ORDER BY up.created_at DESC NULLS LAST
      LIMIT ${limit} OFFSET ${offset}
    `,
    prisma.$queryRaw<[{ cnt: bigint }]>`SELECT COUNT(*)::bigint as cnt FROM public.user_profiles`,
  ]);

  return { users: rows, total: Number(countResult[0].cnt) };
}

export async function getUserById(id: string): Promise<{
  user: AdminUserRow;
  properties: AdminPropertyRow[];
} | null> {
  const [userRows, properties] = await Promise.all([
    prisma.$queryRaw<AdminUserRow[]>`
      SELECT
        up.user_id,
        COALESCE(au.email, up.email) AS email,
        (au.email_confirmed_at IS NOT NULL) AS email_confirmed,
        au.last_sign_in_at::text,
        up.created_at::text,
        up.full_name,
        up.first_name,
        up.last_name,
        up.avatar_url,
        up.city,
        up.phone,
        up.bio,
        up.profession,
        COALESCE(up.verified, false) AS verified
      FROM public.user_profiles up
      LEFT JOIN auth.users au ON au.id = up.user_id
      WHERE up.user_id = ${id}::uuid
      LIMIT 1
    `,
    prisma.$queryRaw<AdminPropertyRow[]>`
      SELECT
        p.id,
        p.owner_id,
        COALESCE(up.full_name, up.first_name) AS owner_full_name,
        up.email AS owner_email,
        p.title,
        p.city,
        p.monthly_rent,
        p.surface_area,
        p.rooms,
        p.bedrooms,
        COALESCE(p.published, false) AS published,
        COALESCE(p.photos, '{}') AS photos,
        p.cover_image,
        p.cover_path,
        p.created_at::text
      FROM public.properties p
      LEFT JOIN public.user_profiles up ON up.user_id = p.owner_id
      WHERE p.owner_id = ${id}::uuid
      ORDER BY p.created_at DESC
    `,
  ]);

  if (!userRows.length) return null;
  return { user: userRows[0], properties };
}

export async function listProperties(
  page: number,
  limit: number,
): Promise<{ properties: AdminPropertyRow[]; total: number }> {
  const offset = (page - 1) * limit;

  const [rows, countResult] = await Promise.all([
    prisma.$queryRaw<AdminPropertyRow[]>`
      SELECT
        p.id,
        p.owner_id,
        COALESCE(up.full_name, up.first_name, up.email) AS owner_full_name,
        up.email AS owner_email,
        p.title,
        p.city,
        p.monthly_rent,
        p.surface_area,
        p.rooms,
        p.bedrooms,
        COALESCE(p.published, false) AS published,
        COALESCE(p.photos, '{}') AS photos,
        p.cover_image,
        p.cover_path,
        p.created_at::text
      FROM public.properties p
      LEFT JOIN public.user_profiles up ON up.user_id = p.owner_id
      ORDER BY p.created_at DESC NULLS LAST
      LIMIT ${limit} OFFSET ${offset}
    `,
    prisma.$queryRaw<[{ cnt: bigint }]>`SELECT COUNT(*)::bigint as cnt FROM public.properties`,
  ]);

  return { properties: rows, total: Number(countResult[0].cnt) };
}

export async function isAdminUser(userId: string): Promise<boolean> {
  const row = await prisma.adminUser.findUnique({ where: { user_id: userId } });
  return !!row;
}

export async function listMatches(
  page: number,
  limit: number,
): Promise<{ matches: AdminMatchRow[]; total: number }> {
  const offset = (page - 1) * limit;
  const [rows, countResult] = await Promise.all([
    prisma.$queryRaw<AdminMatchRow[]>`
      SELECT
        m.id, m.user_a, m.user_b, m.property_a, m.property_b,
        m.created_at::text,
        ua.full_name AS user_a_name,
        ub.full_name AS user_b_name,
        pa.title AS property_a_title,
        pb.title AS property_b_title
      FROM public.matches m
      LEFT JOIN public.user_profiles ua ON ua.user_id = m.user_a
      LEFT JOIN public.user_profiles ub ON ub.user_id = m.user_b
      LEFT JOIN public.properties pa ON pa.id = m.property_a
      LEFT JOIN public.properties pb ON pb.id = m.property_b
      ORDER BY m.created_at DESC NULLS LAST
      LIMIT ${limit} OFFSET ${offset}
    `,
    prisma.$queryRaw<[{ cnt: bigint }]>`SELECT COUNT(*)::bigint AS cnt FROM public.matches`,
  ]);
  return { matches: rows, total: Number(countResult[0].cnt) };
}

export async function listSwipes(
  page: number,
  limit: number,
): Promise<{ swipes: AdminSwipeRow[]; total: number }> {
  const offset = (page - 1) * limit;
  const [rows, countResult] = await Promise.all([
    prisma.$queryRaw<AdminSwipeRow[]>`
      SELECT
        s.id, s.user_id, s.property_id, s.action, s.created_at::text,
        up.full_name AS user_name,
        p.title AS property_title
      FROM public.matching_swipes s
      LEFT JOIN public.user_profiles up ON up.user_id = s.user_id
      LEFT JOIN public.properties p ON p.id = s.property_id
      ORDER BY s.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    prisma.$queryRaw<[{ cnt: bigint }]>`SELECT COUNT(*)::bigint AS cnt FROM public.matching_swipes`,
  ]);
  return { swipes: rows, total: Number(countResult[0].cnt) };
}

export async function getSwipeStats(): Promise<{
  totalSwipes: number;
  likes: number;
  dislikes: number;
  superLikes: number;
}> {
  const rows = await prisma.$queryRaw<{ action: string; cnt: bigint }[]>`
    SELECT action, COUNT(*)::bigint AS cnt FROM public.matching_swipes GROUP BY action
  `;
  const map = Object.fromEntries(rows.map((r) => [r.action, Number(r.cnt)]));
  return {
    totalSwipes: Object.values(map).reduce((a, b) => a + b, 0),
    likes: map['like'] ?? 0,
    dislikes: map['dislike'] ?? 0,
    superLikes: map['super_like'] ?? 0,
  };
}

export async function listConversations(
  page: number,
  limit: number,
): Promise<{ conversations: AdminConversationRow[]; total: number }> {
  const offset = (page - 1) * limit;
  const [rows, countResult] = await Promise.all([
    prisma.$queryRaw<AdminConversationRow[]>`
      SELECT
        c.id, c.match_id, c.created_at::text,
        c.last_message_at::text, c.last_message_text,
        (SELECT COUNT(*)::int FROM public.messages m WHERE m.conversation_id = c.id) AS message_count,
        (
          SELECT STRING_AGG(up.full_name, ', ')
          FROM public.conversation_participants cp
          JOIN public.user_profiles up ON up.user_id = cp.user_id
          WHERE cp.conversation_id = c.id
        ) AS participant_names
      FROM public.conversations c
      ORDER BY c.last_message_at DESC NULLS LAST
      LIMIT ${limit} OFFSET ${offset}
    `,
    prisma.$queryRaw<[{ cnt: bigint }]>`SELECT COUNT(*)::bigint AS cnt FROM public.conversations`,
  ]);
  return { conversations: rows, total: Number(countResult[0].cnt) };
}

export async function getConversationMessages(
  conversationId: string,
  page: number,
  limit: number,
): Promise<{ messages: AdminMessageRow[]; total: number }> {
  const offset = (page - 1) * limit;
  const [rows, countResult] = await Promise.all([
    prisma.$queryRaw<AdminMessageRow[]>`
      SELECT
        m.id, m.sender_id, m.content, m.created_at::text,
        up.full_name AS sender_name
      FROM public.messages m
      LEFT JOIN public.user_profiles up ON up.user_id = m.sender_id
      WHERE m.conversation_id = ${conversationId}::uuid
      ORDER BY m.created_at ASC
      LIMIT ${limit} OFFSET ${offset}
    `,
    prisma.$queryRaw<[{ cnt: bigint }]>`
      SELECT COUNT(*)::bigint AS cnt FROM public.messages WHERE conversation_id = ${conversationId}::uuid
    `,
  ]);
  return { messages: rows, total: Number(countResult[0].cnt) };
}

export async function getMetricsSummary(): Promise<{
  users: { total: number; verified: number; withAvatar: number; withProperty: number };
  properties: { total: number; published: number; draft: number };
  matches: { total: number; last24h: number; last7d: number };
  swipes: { total: number; likes: number; dislikes: number; last24h: number };
  conversations: { total: number; withMessages: number };
  messages: { total: number; last24h: number };
}> {
  const [
    userTotal, userVerified, userAvatar, userProperty,
    propTotal, propPublished,
    matchTotal, match24h, match7d,
    swipeTotal, swipeLikes, swipeDislikes, swipe24h,
    convTotal, convWithMsg,
    msgTotal, msg24h,
  ] = await Promise.all([
    prisma.userProfile.count(),
    prisma.userProfile.count({ where: { verified: true } }),
    prisma.userProfile.count({ where: { avatar_url: { not: '' } } }),
    prisma.$queryRaw<[{ cnt: bigint }]>`SELECT COUNT(DISTINCT owner_id)::bigint AS cnt FROM public.properties`.then(r => Number(r[0].cnt)),
    prisma.property.count(),
    prisma.property.count({ where: { published: true } }),
    prisma.match.count(),
    prisma.match.count({ where: { created_at: { gte: new Date(Date.now() - 86400000) } } }),
    prisma.match.count({ where: { created_at: { gte: new Date(Date.now() - 604800000) } } }),
    prisma.swipe.count(),
    prisma.swipe.count({ where: { action: 'like' } }),
    prisma.swipe.count({ where: { action: 'dislike' } }),
    prisma.swipe.count({ where: { created_at: { gte: new Date(Date.now() - 86400000) } } }),
    prisma.conversation.count(),
    prisma.$queryRaw<[{ cnt: bigint }]>`
      SELECT COUNT(*)::bigint AS cnt FROM public.conversations
      WHERE (SELECT COUNT(*) FROM public.messages m WHERE m.conversation_id = conversations.id) > 0
    `.then(r => Number(r[0].cnt)),
    prisma.message.count(),
    prisma.message.count({ where: { created_at: { gte: new Date(Date.now() - 86400000) } } }),
  ]);

  return {
    users: { total: userTotal, verified: userVerified, withAvatar: userAvatar, withProperty: userProperty },
    properties: { total: propTotal, published: propPublished, draft: propTotal - propPublished },
    matches: { total: matchTotal, last24h: match24h, last7d: match7d },
    swipes: { total: swipeTotal, likes: swipeLikes, dislikes: swipeDislikes, last24h: swipe24h },
    conversations: { total: convTotal, withMessages: convWithMsg },
    messages: { total: msgTotal, last24h: msg24h },
  };
}
