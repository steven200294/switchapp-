import type { ChatStep } from "@/shared/ui/chatbot";
import { Home, Sofa, Maximize, Bed, MapPin } from "@/shared/ui/icons";

export function getCoreSteps(t: (key: string) => string): ChatStep[] {
  return [
    {
      id: "property_type",
      type: "chips",
      botMessage: t("typeQuestion"),
      chips: [
        { id: "apartment", label: t("typeApartment"), icon: <MapPin size={18} /> },
        { id: "house", label: t("typeHouse"), icon: <Home size={18} /> },
        { id: "studio", label: t("typeStudio"), icon: <Sofa size={18} /> },
        { id: "loft", label: t("typeLoft"), icon: <Maximize size={18} /> },
        { id: "room", label: t("typeRoom"), icon: <Bed size={18} /> },
      ],
      formatAnswer: (v) => {
        const map: Record<string, string> = {
          apartment: t("typeApartment"), house: t("typeHouse"),
          studio: t("typeStudio"), loft: t("typeLoft"), room: t("typeRoom"),
        };
        return map[v as string] ?? String(v);
      },
    },
    {
      id: "address",
      type: "address",
      botMessage: t("addressQuestion"),
      botSubMessage: t("addressHint"),
      formatAnswer: (v) => {
        const a = v as { display?: string } | undefined;
        return a?.display ?? "";
      },
    },
    {
      id: "dimensions",
      type: "stepper",
      botMessage: t("dimensionsQuestion"),
      steppers: [
        { id: "surface", label: t("surfaceLabel"), min: 5, max: 500, step: 5, defaultValue: 35, suffix: "m²" },
        { id: "rooms", label: t("roomsLabel"), min: 1, max: 15, step: 1, defaultValue: 2 },
      ],
      formatAnswer: (v) => {
        const d = v as Record<string, number> | undefined;
        if (!d) return "";
        return `${d.surface ?? 35}m² · ${d.rooms ?? 2} ${t("roomsUnit")}`;
      },
    },
    {
      id: "rent",
      type: "stepper",
      botMessage: t("rentQuestion"),
      steppers: [
        { id: "rent", label: t("rentLabel"), min: 100, max: 10000, step: 50, defaultValue: 800, suffix: "€" },
      ],
      formatAnswer: (v) => {
        const d = v as Record<string, number> | undefined;
        return d ? `${d.rent ?? 800}€/${t("monthUnit")}` : "";
      },
    },
    {
      id: "description",
      type: "textarea",
      botMessage: t("descriptionQuestion"),
      placeholder: t("descriptionPlaceholder"),
      maxLength: 500,
      required: false,
      formatAnswer: (v) => {
        const text = v as string | undefined;
        if (!text?.trim()) return t("noDescription");
        return text.length > 60 ? `${text.slice(0, 57)}...` : text;
      },
    },
    {
      id: "photos",
      type: "photo",
      botMessage: t("photosQuestion"),
      botSubMessage: t("photosHint"),
      formatAnswer: (v) => {
        const arr = v as unknown[] | undefined;
        if (!arr?.length) return "";
        return `${arr.length} photo${arr.length > 1 ? "s" : ""}`;
      },
    },
    {
      id: "ready",
      type: "actions",
      botMessage: t("readyMessage"),
      actions: [
        { id: "publish", label: t("actionPublish"), variant: "primary" },
        { id: "details", label: t("actionDetails"), variant: "secondary" },
        { id: "draft", label: t("actionDraft"), variant: "ghost" },
      ],
    },
  ];
}
