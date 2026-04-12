import prisma from '../../infra/prisma/client.js';

export interface GeoCoords {
  latitude: number;
  longitude: number;
}

export async function findCached(
  address: string,
  city: string,
  postalCode: string,
  country: string,
): Promise<GeoCoords | null> {
  const row = await prisma.geocodingCache.findUnique({
    where: {
      address_city_postal_code_country: {
        address,
        city,
        postal_code: postalCode,
        country,
      },
    },
  });
  if (!row) return null;
  return { latitude: row.latitude, longitude: row.longitude };
}

export async function upsertCache(
  address: string,
  city: string,
  postalCode: string,
  country: string,
  coords: GeoCoords,
  provider: string,
): Promise<void> {
  await prisma.geocodingCache.upsert({
    where: {
      address_city_postal_code_country: {
        address,
        city,
        postal_code: postalCode,
        country,
      },
    },
    update: { latitude: coords.latitude, longitude: coords.longitude, provider },
    create: {
      address,
      city,
      postal_code: postalCode,
      country,
      latitude: coords.latitude,
      longitude: coords.longitude,
      provider,
    },
  });
}
