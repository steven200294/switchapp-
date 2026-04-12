import type { Job } from 'bullmq';
import prisma from '../prisma.js';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'SwitchAppart/1.0 (contact@switchappart.com)';
const TIMEOUT_MS = 5_000;

interface GeoCoords { latitude: number; longitude: number }

async function nominatimLookup(
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { lat: string; lon: string }[];
    if (!data.length) return null;

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return { latitude: lat, longitude: lon };
  } finally {
    clearTimeout(timer);
  }
}

async function resolveCoords(
  address: string,
  city: string,
  postalCode: string,
  country: string,
): Promise<GeoCoords | null> {
  const cached = await prisma.geocodingCache.findUnique({
    where: { address_city_postal_code_country: { address, city, postal_code: postalCode, country } },
  });
  if (cached) return { latitude: cached.latitude, longitude: cached.longitude };

  const coords = await nominatimLookup(address, city, postalCode, country);
  if (!coords) return null;

  await prisma.geocodingCache.upsert({
    where: { address_city_postal_code_country: { address, city, postal_code: postalCode, country } },
    update: { latitude: coords.latitude, longitude: coords.longitude },
    create: { address, city, postal_code: postalCode, country, ...coords, provider: 'nominatim' },
  });

  return coords;
}

export async function processGeocodeProperty(job: Job<{ propertyId: string }>): Promise<void> {
  const { propertyId } = job.data;

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) {
    console.log(`[geocode] property ${propertyId} not found, skipping`);
    return;
  }

  if (property.latitude !== null && property.longitude !== null) {
    console.log(`[geocode] property ${propertyId} already geocoded, skipping`);
    return;
  }

  const coords = await resolveCoords(
    property.address ?? '',
    property.city ?? '',
    property.postal_code ?? '',
    property.country ?? 'France',
  );

  if (!coords) {
    console.log(`[geocode] no results for property ${propertyId} (${property.city})`);
    return;
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: { latitude: coords.latitude, longitude: coords.longitude },
  });

  console.log(`[geocode] property ${propertyId}: ${property.city} -> ${coords.latitude}, ${coords.longitude}`);
}
