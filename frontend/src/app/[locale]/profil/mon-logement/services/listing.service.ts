import { apiFetch } from "@/shared/services/api";
import type { ChatData } from "@/shared/ui/chatbot";
import type { PhotoItem } from "@/shared/ui/chatbot";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AddressData {
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;
  district?: string;
  lat?: number;
  lng?: number;
}

interface UploadResult {
  urls: string[];
  paths: string[];
}

async function uploadPhotos(files: File[]): Promise<UploadResult> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const formData = new FormData();
  files.forEach((file) => formData.append("photos", file));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(`${API_URL}/uploads/photos`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      signal: controller.signal,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Upload failed");
    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}

async function resolvePhotos(raw: unknown): Promise<{ urls: string[]; paths: string[] }> {
  if (!raw || !Array.isArray(raw) || raw.length === 0) return { urls: [], paths: [] };

  const items = raw as (PhotoItem | File)[];
  const existingUrls: string[] = [];
  const existingPaths: string[] = [];
  const newFiles: File[] = [];

  for (const item of items) {
    if (item instanceof File) {
      newFiles.push(item);
    } else if (item.type === "url") {
      existingUrls.push(item.url);
      existingPaths.push(item.path ?? "");
    } else if (item.type === "file" && item.file) {
      newFiles.push(item.file);
    }
  }

  if (newFiles.length > 0) {
    try {
      const uploaded = await uploadPhotos(newFiles);
      existingUrls.push(...uploaded.urls);
      existingPaths.push(...uploaded.paths);
    } catch {
      console.warn("Photo upload failed — publishing without new photos");
    }
  }

  return { urls: existingUrls, paths: existingPaths };
}

function mapChatDataToPayload(data: ChatData, photoUrls: string[], photoPaths: string[]) {
  const addr = data.address as AddressData | undefined;
  const dims = data.dimensions as Record<string, number> | undefined;
  const rentData = data.rent as Record<string, number> | undefined;
  const roomsDetail = data.rooms_detail as Record<string, number> | undefined;
  const conditions = data.conditions as string[] | undefined;
  const amenities = data.amenities as string[] | undefined;
  const depositData = data.deposit_detail as Record<string, number> | undefined;

  const propertyType = (data.property_type as string) || "apartment";
  const city = addr?.city || "Unknown";

  const titleMap: Record<string, string> = {
    apartment: "Appartement", house: "Maison", studio: "Studio",
    loft: "Loft", room: "Chambre",
  };
  const title = `${titleMap[propertyType] || propertyType} - ${city}`;

  const description = (data.description as string) || "";

  const payload: Record<string, unknown> = {
    title,
    description,
    property_type: propertyType,
    address: addr?.address || "",
    city,
    postal_code: addr?.postalCode || "",
    surface_area: dims?.surface || 30,
    rooms: dims?.rooms || 1,
    monthly_rent: rentData?.rent || 0,
    amenities: amenities || [],
  };

  if (addr?.district) payload.district = addr.district;
  if (roomsDetail?.bedrooms !== undefined) payload.bedrooms = roomsDetail.bedrooms;
  if (roomsDetail?.bathrooms !== undefined) payload.bathrooms = roomsDetail.bathrooms;
  if (depositData?.deposit) payload.deposit = depositData.deposit;
  if (conditions?.includes("furnished")) payload.furnished = true;
  if (conditions?.includes("pets")) payload.pets_allowed = true;
  if (conditions?.includes("smoker")) payload.smoking_allowed = true;
  if (conditions?.includes("utilities")) payload.utilities_included = true;

  if (photoUrls.length > 0) {
    payload.photos = photoUrls;
    payload.photo_paths = photoPaths;
    payload.cover_image = photoUrls[0];
    payload.cover_path = photoPaths[0];
  }

  return payload;
}

export async function publishProperty(data: ChatData): Promise<void> {
  const { urls, paths } = await resolvePhotos(data.photos);
  const payload = mapChatDataToPayload(data, urls, paths);
  await apiFetch("/properties", {
    method: "POST",
    body: JSON.stringify({ ...payload, status: "published" }),
  });
}

export async function saveDraftProperty(data: ChatData): Promise<void> {
  const { urls, paths } = await resolvePhotos(data.photos);
  const payload = mapChatDataToPayload(data, urls, paths);
  await apiFetch("/properties/draft", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
