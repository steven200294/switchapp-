import prisma from '../../infra/prisma/client.js';
import * as feedRepo from './feed.repository.js';
import type { UserPreferences } from './feed.repository.js';

interface FeedCategory {
  slug: string;
  title_key: string;
  properties: unknown[];
  total: number;
  personalized: boolean;
}

interface CityCategory extends FeedCategory {
  city: string;
}

interface FeedResult {
  categories: (FeedCategory | CityCategory)[];
}

async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const profile = await prisma.userProfile.findUnique({
    where: { user_id: userId },
    select: {
      city: true,
      budget_min: true,
      budget_max: true,
      preferred_property_types: true,
      preferred_amenities: true,
      surface_min: true,
    },
  });
  return profile;
}

function hasPreferences(prefs: UserPreferences | null): boolean {
  if (!prefs) return false;
  return !!(
    prefs.city ||
    (prefs.budget_min && prefs.budget_min > 0) ||
    (prefs.budget_max && prefs.budget_max < 100000) ||
    (prefs.preferred_property_types && prefs.preferred_property_types.length > 0) ||
    prefs.surface_min
  );
}

interface CategoryPageResult {
  slug: string;
  title_key: string;
  properties: unknown[];
  total: number;
  page: number;
  limit: number;
  city?: string;
}

export async function getCategoryPage(
  slug: string,
  page: number,
  limit: number,
  userId?: string,
  city?: string,
): Promise<CategoryPageResult> {
  const skip = (page - 1) * limit;
  let prefs: UserPreferences | null = null;
  if (userId) prefs = await getUserPreferences(userId);

  switch (slug) {
    case 'favorites': {
      const all = await feedRepo.findTopFavorited(1000);
      return { slug, title_key: 'topPicks', properties: all.slice(skip, skip + limit), total: all.length, page, limit };
    }
    case 'newest':
      return paginatedSimple(slug, 'newest', feedRepo.findNewest, skip, limit, page);
    case 'budget-friendly':
      return paginatedSimple(slug, 'budgetFriendly', (l) => feedRepo.findBudgetFriendly(l), skip, limit, page);
    case 'furnished':
      return paginatedSimple(slug, 'furnishedReady', feedRepo.findFurnishedReady, skip, limit, page);
    case 'large-spaces':
      return paginatedSimple(slug, 'largeSpaces', feedRepo.findLargeSpaces, skip, limit, page);
    case 'pet-friendly':
      return paginatedSimple(slug, 'petFriendly', feedRepo.findPetFriendly, skip, limit, page);
    case 'for-you': {
      if (!prefs) return { slug, title_key: 'forYou', properties: [], total: 0, page, limit };
      const all = await feedRepo.findForYou(prefs, 1000);
      return { slug, title_key: 'forYou', properties: all.slice(skip, skip + limit), total: all.length, page, limit };
    }
    case 'in-budget': {
      if (!prefs) return { slug, title_key: 'inBudget', properties: [], total: 0, page, limit };
      const all = await feedRepo.findInBudget(prefs.budget_min ?? 0, prefs.budget_max ?? 100000, 1000);
      return { slug, title_key: 'inBudget', properties: all.slice(skip, skip + limit), total: all.length, page, limit };
    }
    case 'your-type': {
      if (!prefs?.preferred_property_types?.length) return { slug, title_key: 'yourType', properties: [], total: 0, page, limit };
      const all = await feedRepo.findByPropertyTypes(prefs.preferred_property_types, 1000);
      return { slug, title_key: 'yourType', properties: all.slice(skip, skip + limit), total: all.length, page, limit };
    }
    case 'near-you': {
      const c = city || prefs?.city;
      if (!c) return { slug, title_key: 'nearYou', properties: [], total: 0, page, limit };
      const all = await feedRepo.findNearUser(c, 1000);
      return { slug, title_key: 'nearYou', properties: all.slice(skip, skip + limit), total: all.length, page, limit, city: c };
    }
    default: {
      if (slug.startsWith('city-')) {
        const cityName = city || slug.replace('city-', '').replace(/-/g, ' ');
        const all = await feedRepo.findNearUser(cityName, 1000);
        return { slug, title_key: 'inCity', properties: all.slice(skip, skip + limit), total: all.length, page, limit, city: cityName };
      }
      return { slug, title_key: slug, properties: [], total: 0, page, limit };
    }
  }
}

async function paginatedSimple(
  slug: string, titleKey: string,
  fetcher: (limit: number) => Promise<unknown[]>,
  skip: number, limit: number, page: number,
): Promise<CategoryPageResult> {
  const all = await fetcher(1000);
  return { slug, title_key: titleKey, properties: all.slice(skip, skip + limit), total: all.length, page, limit };
}

export async function getFeed(userId?: string): Promise<FeedResult> {
  const categories: (FeedCategory | CityCategory)[] = [];

  let prefs: UserPreferences | null = null;
  if (userId) {
    prefs = await getUserPreferences(userId);
  }

  const [favorites, newest, budget, furnished, large, pets, cities] = await Promise.all([
    feedRepo.findTopFavorited(),
    feedRepo.findNewest(),
    feedRepo.findBudgetFriendly(),
    feedRepo.findFurnishedReady(),
    feedRepo.findLargeSpaces(),
    feedRepo.findPetFriendly(),
    feedRepo.findTopCities(),
  ]);

  if (prefs && hasPreferences(prefs)) {
    const [forYou, inBudget, byType, nearUser] = await Promise.all([
      feedRepo.findForYou(prefs),
      prefs.budget_min || prefs.budget_max
        ? feedRepo.findInBudget(prefs.budget_min ?? 0, prefs.budget_max ?? 100000)
        : Promise.resolve([]),
      prefs.preferred_property_types?.length
        ? feedRepo.findByPropertyTypes(prefs.preferred_property_types)
        : Promise.resolve([]),
      prefs.city
        ? feedRepo.findNearUser(prefs.city)
        : Promise.resolve([]),
    ]);

    if (forYou.length > 0) {
      categories.push({
        slug: 'for-you', title_key: 'forYou',
        properties: forYou, total: forYou.length, personalized: true,
      });
    }

    categories.push(
      { slug: 'favorites', title_key: 'topPicks', properties: favorites, total: favorites.length, personalized: false },
      { slug: 'newest', title_key: 'newest', properties: newest, total: newest.length, personalized: false },
    );

    if (inBudget.length > 0) {
      categories.push({
        slug: 'in-budget', title_key: 'inBudget',
        properties: inBudget, total: inBudget.length, personalized: true,
      });
    }

    if (byType.length > 0) {
      categories.push({
        slug: 'your-type', title_key: 'yourType',
        properties: byType, total: byType.length, personalized: true,
      });
    }

    categories.push(
      { slug: 'budget-friendly', title_key: 'budgetFriendly', properties: budget, total: budget.length, personalized: false },
      { slug: 'furnished', title_key: 'furnishedReady', properties: furnished, total: furnished.length, personalized: false },
      { slug: 'large-spaces', title_key: 'largeSpaces', properties: large, total: large.length, personalized: false },
    );

    if (nearUser.length > 0) {
      categories.push({
        slug: 'near-you', title_key: 'nearYou',
        properties: nearUser, total: nearUser.length, personalized: true,
        city: prefs.city!,
      } as CityCategory);
    }

    categories.push(
      { slug: 'pet-friendly', title_key: 'petFriendly', properties: pets, total: pets.length, personalized: false },
    );
  } else {
    categories.push(
      { slug: 'favorites', title_key: 'topPicks', properties: favorites, total: favorites.length, personalized: false },
      { slug: 'newest', title_key: 'newest', properties: newest, total: newest.length, personalized: false },
      { slug: 'budget-friendly', title_key: 'budgetFriendly', properties: budget, total: budget.length, personalized: false },
      { slug: 'furnished', title_key: 'furnishedReady', properties: furnished, total: furnished.length, personalized: false },
      { slug: 'large-spaces', title_key: 'largeSpaces', properties: large, total: large.length, personalized: false },
      { slug: 'pet-friendly', title_key: 'petFriendly', properties: pets, total: pets.length, personalized: false },
    );
  }

  for (const c of cities) {
    categories.push({
      slug: `city-${c.city.toLowerCase().replace(/\s+/g, '-')}`,
      title_key: 'inCity',
      properties: c.properties,
      total: c.total,
      personalized: false,
      city: c.city,
    } as CityCategory);
  }

  return { categories: categories.filter((c) => c.properties.length > 0) };
}
