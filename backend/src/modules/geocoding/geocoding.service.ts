import prisma from '../../infra/prisma/client.js';
import { logger } from '../../config/logger.js';
import * as repo from './geocoding.repository.js';
import { geocodeWithNominatim } from './geocoding.provider.js';
import { getGeocodingQueue } from '../../infra/redis/queues.js';
import { GEOCODING_JOB_NAME } from './geocoding.constants.js';
import type { GeoCoords } from './geocoding.repository.js';

export type { GeoCoords };

/**
 * Synchronous geocode: checks cache first, then calls Nominatim.
 * Returns coords or null; never throws.
 */
export async function geocode(
  address: string,
  city: string,
  postalCode: string,
  country = 'France',
): Promise<GeoCoords | null> {
  try {
    const cached = await repo.findCached(address, city, postalCode, country);
    if (cached) return cached;

    const coords = await geocodeWithNominatim(address, city, postalCode, country);
    if (!coords) return null;

    await repo.upsertCache(address, city, postalCode, country, coords, 'nominatim');
    return coords;
  } catch (err) {
    logger.warn(`Geocoding failed for "${address}, ${city} ${postalCode}, ${country}": ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

/**
 * Enqueue a BullMQ job to geocode a property asynchronously.
 * Used when we want non-blocking geocoding (batch backfill, etc).
 */
export async function enqueueGeocode(propertyId: string): Promise<void> {
  const queue = getGeocodingQueue();
  await queue.add(GEOCODING_JOB_NAME, { propertyId }, {
    jobId: `geocode-${propertyId}`,
  });
}

/**
 * Process a geocoding job: fetch property, geocode, update lat/lng.
 * Called by the worker, not by the API.
 */
export async function processGeocodingJob(propertyId: string): Promise<void> {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) return;

  if (property.latitude !== null && property.longitude !== null) return;

  const coords = await geocode(
    property.address ?? '',
    property.city ?? '',
    property.postal_code ?? '',
    property.country ?? 'France',
  );

  if (!coords) return;

  await prisma.property.update({
    where: { id: propertyId },
    data: { latitude: coords.latitude, longitude: coords.longitude },
  });
}
