import prisma from '../../infra/prisma/client.js';

const FEED_LIMIT = 9;

const ownerSelect = {
  full_name: true, avatar_url: true, verified: true,
  user_id: true, profession: true, city: true,
} as const;

const publishedWhere = { published: true, status: 'published' } as const;

const includeOwner = { owner: { select: ownerSelect } } as const;

export async function findTopFavorited(limit = FEED_LIMIT) {
  const rows = await prisma.$queryRaw<{ property_id: string; fav_count: bigint }[]>`
    SELECT f.property_id, COUNT(f.id) AS fav_count
    FROM favorites f
    JOIN properties p ON p.id = f.property_id
    WHERE p.published = true AND p.status = 'published'
    GROUP BY f.property_id
    HAVING COUNT(f.id) > 0
    ORDER BY fav_count DESC
    LIMIT ${limit}
  `;

  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.property_id);

  const properties = await prisma.property.findMany({
    where: { id: { in: ids } },
    include: includeOwner,
  });

  const idOrder = new Map(ids.map((id, i) => [id, i]));
  return properties.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0));
}

export async function findNewest(limit = FEED_LIMIT) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);

  const results = await prisma.property.findMany({
    where: { ...publishedWhere, created_at: { gte: sevenDaysAgo } },
    include: includeOwner,
    orderBy: { created_at: 'desc' },
    take: limit,
  });

  if (results.length < limit) {
    return prisma.property.findMany({
      where: publishedWhere,
      include: includeOwner,
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }
  return results;
}

export async function findBudgetFriendly(limit = FEED_LIMIT, maxRent = 700) {
  return prisma.property.findMany({
    where: { ...publishedWhere, monthly_rent: { gt: 0, lte: maxRent } },
    include: includeOwner,
    orderBy: { monthly_rent: 'asc' },
    take: limit,
  });
}

export async function findFurnishedReady(limit = FEED_LIMIT) {
  return prisma.property.findMany({
    where: { ...publishedWhere, furnished: true, is_available: true },
    include: includeOwner,
    orderBy: { created_at: 'desc' },
    take: limit,
  });
}

export async function findLargeSpaces(limit = FEED_LIMIT, minSurface = 50) {
  return prisma.property.findMany({
    where: { ...publishedWhere, surface_area: { gte: minSurface } },
    include: includeOwner,
    orderBy: { surface_area: 'desc' },
    take: limit,
  });
}

export async function findPetFriendly(limit = FEED_LIMIT) {
  return prisma.property.findMany({
    where: { ...publishedWhere, pets_allowed: true },
    include: includeOwner,
    orderBy: { created_at: 'desc' },
    take: limit,
  });
}

export async function findTopCities(maxCities = 3, perCity = FEED_LIMIT) {
  const cityRows = await prisma.$queryRaw<{ city: string; cnt: bigint }[]>`
    SELECT city, COUNT(*) AS cnt
    FROM properties
    WHERE published = true AND status = 'published' AND city IS NOT NULL AND city != ''
    GROUP BY city
    ORDER BY cnt DESC
    LIMIT ${maxCities}
  `;

  const results: { city: string; total: number; properties: unknown[] }[] = [];

  for (const row of cityRows) {
    const properties = await prisma.property.findMany({
      where: { ...publishedWhere, city: row.city },
      include: includeOwner,
      orderBy: { created_at: 'desc' },
      take: perCity,
    });
    results.push({ city: row.city, total: Number(row.cnt), properties });
  }

  return results;
}

export interface UserPreferences {
  city?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  preferred_property_types?: string[];
  preferred_amenities?: string[];
  surface_min?: number | null;
}

export async function findForYou(prefs: UserPreferences, limit = FEED_LIMIT) {
  const where: Record<string, unknown> = { ...publishedWhere };

  if (prefs.city) where.city = { contains: prefs.city, mode: 'insensitive' };
  if (prefs.budget_min || prefs.budget_max) {
    const rent: Record<string, number> = {};
    if (prefs.budget_min) rent.gte = prefs.budget_min;
    if (prefs.budget_max) rent.lte = prefs.budget_max;
    where.monthly_rent = rent;
  }
  if (prefs.preferred_property_types?.length) {
    where.property_type = { in: prefs.preferred_property_types };
  }
  if (prefs.surface_min) {
    where.surface_area = { gte: prefs.surface_min };
  }

  return prisma.property.findMany({
    where,
    include: includeOwner,
    orderBy: { created_at: 'desc' },
    take: limit,
  });
}

export async function findInBudget(min: number, max: number, limit = FEED_LIMIT) {
  return prisma.property.findMany({
    where: { ...publishedWhere, monthly_rent: { gte: min, lte: max } },
    include: includeOwner,
    orderBy: { monthly_rent: 'asc' },
    take: limit,
  });
}

export async function findByPropertyTypes(types: string[], limit = FEED_LIMIT) {
  return prisma.property.findMany({
    where: { ...publishedWhere, property_type: { in: types } },
    include: includeOwner,
    orderBy: { created_at: 'desc' },
    take: limit,
  });
}

export async function findNearUser(city: string, limit = FEED_LIMIT) {
  return prisma.property.findMany({
    where: { ...publishedWhere, city: { contains: city, mode: 'insensitive' } },
    include: includeOwner,
    orderBy: { created_at: 'desc' },
    take: limit,
  });
}

export async function countPublished(): Promise<number> {
  return prisma.property.count({ where: publishedWhere });
}
