/**
 * One-time script: geocode all properties with NULL lat/lng using Nominatim.
 * Respects Nominatim rate limit (1 req/s).
 *
 * Usage:
 *   DATABASE_URL=postgresql://... npx tsx data/backfill-geocode.ts
 *
 * Or for mock DB:
 *   DATABASE_URL=postgresql://.../switchapp_mock npx tsx data/backfill-geocode.ts
 */
import { PrismaClient } from '@prisma/client';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'SwitchAppart/1.0 (contact@switchappart.com)';
const DELAY_MS = 1_100;

interface GeoCoords { latitude: number; longitude: number }

async function geocode(
  address: string,
  city: string,
  postalCode: string,
  country: string,
): Promise<GeoCoords | null> {
  const parts = [address, city, postalCode, country].filter(Boolean);
  const q = parts.join(', ');
  if (!q.trim()) return null;

  const url = new URL(NOMINATIM_BASE);
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');

  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { lat: string; lon: string }[];
    if (!data.length) return null;

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return { latitude: lat, longitude: lon };
  } catch {
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL is required');

  const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

  const properties = await prisma.property.findMany({
    where: {
      latitude: null,
      OR: [
        { address: { not: '' } },
        { city: { not: '' } },
      ],
    },
    select: { id: true, address: true, city: true, postal_code: true, country: true },
  });

  console.log(`Found ${properties.length} properties to geocode.`);

  let success = 0;
  let failed = 0;

  for (const p of properties) {
    const coords = await geocode(
      p.address ?? '',
      p.city ?? '',
      p.postal_code ?? '',
      p.country ?? 'France',
    );

    if (coords) {
      await prisma.property.update({
        where: { id: p.id },
        data: { latitude: coords.latitude, longitude: coords.longitude },
      });

      await prisma.geocodingCache.upsert({
        where: {
          address_city_postal_code_country: {
            address: p.address ?? '',
            city: p.city ?? '',
            postal_code: p.postal_code ?? '',
            country: p.country ?? 'France',
          },
        },
        update: { latitude: coords.latitude, longitude: coords.longitude },
        create: {
          address: p.address ?? '',
          city: p.city ?? '',
          postal_code: p.postal_code ?? '',
          country: p.country ?? 'France',
          latitude: coords.latitude,
          longitude: coords.longitude,
          provider: 'nominatim',
        },
      });

      console.log(`  OK  ${p.id}: ${p.city} -> ${coords.latitude}, ${coords.longitude}`);
      success++;
    } else {
      console.log(`  FAIL ${p.id}: ${p.city ?? 'no city'} (no results)`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone. Success: ${success}, Failed: ${failed}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
