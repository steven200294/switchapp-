import {
  NOMINATIM_BASE,
  NOMINATIM_USER_AGENT,
  NOMINATIM_TIMEOUT_MS,
} from './geocoding.constants.js';
import type { GeoCoords } from './geocoding.repository.js';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function geocodeWithNominatim(
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
  url.searchParams.set('addressdetails', '0');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NOMINATIM_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': NOMINATIM_USER_AGENT },
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const data = (await res.json()) as NominatimResult[];
    if (!data.length) return null;

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return { latitude: lat, longitude: lon };
  } finally {
    clearTimeout(timer);
  }
}
