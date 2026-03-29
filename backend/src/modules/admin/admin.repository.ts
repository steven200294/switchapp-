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
