import type { ChatStep, RatingConfig } from "@/shared/ui/chatbot";
import { Bed, Bath, Wifi, ParkingCircle, Snowflake, Tv, WashingMachine, Refrigerator, Microwave, Coffee } from "@/shared/ui/icons";

const DPE: RatingConfig = { id: "dpe", label: "DPE", grades: ["A", "B", "C", "D", "E", "F", "G"] };
const GES: RatingConfig = { id: "ges", label: "GES", grades: ["A", "B", "C", "D", "E", "F", "G"] };

export function getDetailSteps(t: (key: string) => string): ChatStep[] {
  return [
    {
      id: "rooms_detail",
      type: "stepper",
      botMessage: t("roomsDetailQuestion"),
      steppers: [
        { id: "bedrooms", label: t("bedroomsLabel"), min: 0, max: 10, step: 1, defaultValue: 1 },
        { id: "bathrooms", label: t("bathroomsLabel"), min: 1, max: 5, step: 1, defaultValue: 1 },
      ],
      formatAnswer: (v) => {
        const d = v as Record<string, number> | undefined;
        return d ? `${d.bedrooms ?? 1} ch. · ${d.bathrooms ?? 1} sdb` : "";
      },
    },
    {
      id: "energy",
      type: "rating",
      botMessage: t("energyQuestion"),
      ratings: [DPE, GES],
      required: false,
      formatAnswer: (v) => {
        const d = v as Record<string, string> | undefined;
        if (!d) return t("notSpecified");
        const p = [];
        if (d.dpe) p.push(`DPE ${d.dpe}`);
        if (d.ges) p.push(`GES ${d.ges}`);
        return p.length ? p.join(" · ") : t("notSpecified");
      },
    },
    {
      id: "amenities",
      type: "toggles",
      botMessage: t("amenitiesQuestion"),
      toggles: [
        { id: "wifi", label: "Wi-Fi", icon: <Wifi size={16} /> },
        { id: "parking", label: "Parking", icon: <ParkingCircle size={16} /> },
        { id: "ac", label: t("airConditioning"), icon: <Snowflake size={16} /> },
        { id: "tv", label: "TV", icon: <Tv size={16} /> },
        { id: "washing", label: t("washingMachine"), icon: <WashingMachine size={16} /> },
        { id: "fridge", label: t("fridge"), icon: <Refrigerator size={16} /> },
        { id: "microwave", label: t("microwave"), icon: <Microwave size={16} /> },
        { id: "coffee", label: t("coffeeMaker"), icon: <Coffee size={16} /> },
      ],
      required: false,
      formatAnswer: (v) => {
        const arr = v as string[] | undefined;
        return arr?.length ? `${arr.length} ${t("amenitiesCount")}` : t("none");
      },
    },
    {
      id: "conditions",
      type: "toggles",
      botMessage: t("conditionsQuestion"),
      toggles: [
        { id: "furnished", label: t("furnished"), icon: <Bed size={16} /> },
        { id: "pets", label: t("petsAllowed") },
        { id: "smoker", label: t("smokerAllowed") },
        { id: "utilities", label: t("utilitiesIncl") },
      ],
      required: false,
      formatAnswer: (v) => {
        const arr = v as string[] | undefined;
        return arr?.length ? arr.join(", ") : t("noOption");
      },
    },
    {
      id: "deposit_detail",
      type: "stepper",
      botMessage: t("depositQuestion"),
      steppers: [
        { id: "deposit", label: t("depositLabel"), min: 0, max: 20000, step: 100, defaultValue: 0, suffix: "€" },
      ],
      required: false,
      formatAnswer: (v) => {
        const d = v as Record<string, number> | undefined;
        return d?.deposit ? `${d.deposit}€` : t("notSpecified");
      },
    },
    {
      id: "detail_done",
      type: "actions",
      botMessage: t("detailsDoneMessage"),
      actions: [
        { id: "publish", label: t("actionPublish"), variant: "primary" },
        { id: "draft", label: t("actionDraft"), variant: "ghost" },
      ],
    },
  ];
}
