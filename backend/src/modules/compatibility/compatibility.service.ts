import prisma from "../../infra/prisma/client.js";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ERROR_CODES, CLIENT_MESSAGES } from "../../shared/errors/errorCodes.js";
import * as propertiesRepo from "../properties/properties.repository.js";
import { compatibilityAiResultSchema, type CompatibilityResult } from "./compatibility.schemas.js";
import { requestCompatibilityJson } from "./compatibility.provider.js";

const SYSTEM_PROMPT = `You are a French housing exchange assistant for SwitchAppart.
Compare the viewer's search preferences and optional own listing with the viewed property.
Respond ONLY with a single JSON object (no markdown) with keys:
- score: integer 0-100 (overall fit for an apartment swap)
- commonPoints: array of short French strings (strengths, max 8 items)
- weakPoints: array of short French strings (gaps or compromises, max 8 items; empty if score >= 85)
- recommendation: one short French paragraph (max 600 characters)

Be fair: mention location, budget vs rent, surface, dates, property type, amenities, and exchange fairness if both listings exist.`;

export async function getCompatibilityForProperty(
  viewerUserId: string,
  propertyId: string,
): Promise<CompatibilityResult> {
  if (!env.ai.apiKey) {
    throw new AppError(ERROR_CODES.AI_NOT_CONFIGURED, 503, CLIENT_MESSAGES[ERROR_CODES.AI_NOT_CONFIGURED]);
  }

  const [viewerProfile, property] = await Promise.all([
    prisma.userProfile.findUnique({ where: { user_id: viewerUserId } }),
    prisma.property.findUnique({
      where: { id: propertyId, published: true, status: 'published' },
      include: { owner: true },
    }),
  ]);

  if (!property) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }

  const myProperty = await propertiesRepo.findFirstPublishedByOwner(viewerUserId);

  const payload = {
    viewer: viewerProfile
      ? {
          city: viewerProfile.city,
          preferred_district: viewerProfile.preferred_district,
          preferred_neighborhood: viewerProfile.preferred_neighborhood,
          budget_min: viewerProfile.budget_min,
          budget_max: viewerProfile.budget_max,
          surface_min: viewerProfile.surface_min,
          preferred_property_types: viewerProfile.preferred_property_types,
          preferred_amenities: viewerProfile.preferred_amenities,
        }
      : null,
    myListing: myProperty
      ? {
          city: myProperty.city,
          district: myProperty.district,
          monthly_rent: myProperty.monthly_rent,
          surface_area: myProperty.surface_area,
          rooms: myProperty.rooms,
          property_type: myProperty.property_type,
          available_from: myProperty.available_from,
          available_until: myProperty.available_until,
          amenities: myProperty.amenities,
        }
      : null,
    viewedProperty: {
      id: property.id,
      title: property.title,
      city: property.city,
      district: property.district,
      monthly_rent: property.monthly_rent,
      surface_area: property.surface_area,
      rooms: property.rooms,
      property_type: property.property_type,
      available_from: property.available_from,
      available_until: property.available_until,
      amenities: property.amenities,
      furnished: property.furnished,
      pets_allowed: property.pets_allowed,
    },
    owner: property.owner
      ? {
          city: property.owner.city,
        }
      : null,
  };

  try {
    const raw = await requestCompatibilityJson(SYSTEM_PROMPT, JSON.stringify(payload, null, 2));
    let json: unknown;
    try {
      json = JSON.parse(raw) as unknown;
    } catch {
      throw new AppError(ERROR_CODES.SERVICE_UNAVAILABLE, 503, CLIENT_MESSAGES[ERROR_CODES.SERVICE_UNAVAILABLE]);
    }
    const parsed = compatibilityAiResultSchema.safeParse(json);
    if (!parsed.success) {
      logger.warn(`compatibility AI JSON validation failed: ${parsed.error.message}`);
      throw new AppError(ERROR_CODES.SERVICE_UNAVAILABLE, 503, CLIENT_MESSAGES[ERROR_CODES.SERVICE_UNAVAILABLE]);
    }
    return parsed.data;
  } catch (e) {
    logger.error(`compatibility AI request failed: ${e instanceof Error ? e.message : String(e)}`);
    if (e instanceof AppError) throw e;
    throw new AppError(ERROR_CODES.SERVICE_UNAVAILABLE, 503, CLIENT_MESSAGES[ERROR_CODES.SERVICE_UNAVAILABLE]);
  }
}
