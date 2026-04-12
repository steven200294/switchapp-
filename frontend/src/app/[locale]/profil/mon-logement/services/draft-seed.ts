import type { ChatData } from "@/shared/ui/chatbot";
import type { PhotoItem } from "@/shared/ui/chatbot";
import type { MyProperty } from "../../types/property.types";

const DRAFT_KEY = "switchapp_listing_draft";
const DETAILS_KEY = `${DRAFT_KEY}_details`;

/**
 * Converts a MyProperty (from the API) back into ChatData format
 * and seeds localStorage so the chatbot resumes from where the user left off.
 */
export function seedDraftFromProperty(p: MyProperty): void {
  const core: ChatData = {};

  if (p.property_type) {
    core.property_type = p.property_type;
  }

  if (p.address || p.city) {
    core.address = {
      address: p.address ?? "",
      city: p.city ?? "",
      postalCode: p.postal_code ?? "",
      display: [p.address, p.city].filter(Boolean).join(", "),
    };
  }

  if ((p.surface_area ?? 0) > 0 || (p.rooms ?? 0) > 0) {
    core.dimensions = {
      surface: p.surface_area ?? 35,
      rooms: p.rooms ?? 2,
    };
  }

  if ((p.monthly_rent ?? 0) > 0) {
    core.rent = { rent: p.monthly_rent! };
  }

  if (p.description) {
    core.description = p.description;
  }

  if (p.photos.length > 0) {
    const photoItems: PhotoItem[] = p.photos.map((url, i) => ({
      type: "url" as const,
      url,
      path: p.photo_paths[i] ?? undefined,
    }));
    core.photos = photoItems;
  }

  localStorage.setItem(DRAFT_KEY, JSON.stringify(core));
  localStorage.removeItem(DETAILS_KEY);
}
