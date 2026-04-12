"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, MapPin, Maximize, Bed, Bath, Trash } from "@/shared/ui/icons";
import type { MyProperty } from "../../types/property.types";
import { useUnpublish, useDeleteProperty, useUpdateProperty } from "../hooks/usePropertyMutations";
import { EditableTextField, EditableNumberField } from "./EditableField";
import PropertyEditSections from "./PropertyEditSections";
import PhotoGallery from "./PhotoGallery";

interface Props {
  property: MyProperty;
  onClose: () => void;
}

export default function PropertyManageView({ property: p, onClose }: Props) {
  const t = useTranslations("propertyManage");
  const tCommon = useTranslations("common");
  const [confirmAction, setConfirmAction] = useState<"unpublish" | "delete" | null>(null);

  const unpublishMutation = useUnpublish(onClose);
  const deleteMutation = useDeleteProperty(onClose);
  const updateMutation = useUpdateProperty();
  const actionLoading = unpublishMutation.isPending || deleteMutation.isPending;

  const save = (data: Record<string, unknown>) => updateMutation.mutate({ id: p.id, data });

  const tSearch = useTranslations("search");
  const typeLabels: Record<string, string> = {
    apartment: tSearch("apartment"), house: tSearch("house"), studio: tSearch("studio"),
    loft: tSearch("loft"), room: tSearch("room"),
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="w-full max-w-2xl mx-auto flex items-center gap-3">
          <button type="button" onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors outline-none">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-title font-bold text-gray-900 flex-1">{t("title")}</h1>
          <span className={`px-3 py-1 rounded-full text-body-sm font-semibold ${p.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {p.published ? t("published") : t("draft")}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-36">
        <div className="max-w-2xl mx-auto px-4">
          {p.published && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-body-sm text-emerald-700 font-medium">
              {t("publishedBanner")}
            </div>
          )}

          <PhotoGallery photos={p.photos} title={p.title} />

          <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-4">
            <EditableTextField
              label={t("editTitle")}
              value={p.title ?? ""}
              onSave={(v) => save({ title: v })}
              saving={updateMutation.isPending}
            />
          </div>

          {p.address && (
            <div className="flex items-center gap-1.5 mt-3 text-gray-500 px-1">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-body-sm font-medium">{p.address}{p.city ? `, ${p.city}` : ""}</span>
            </div>
          )}

          <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-4">
            <EditableTextField
              label={t("description")}
              value={p.description ?? ""}
              onSave={(v) => save({ description: v })}
              saving={updateMutation.isPending}
              multiline
              placeholder={t("descriptionPlaceholder")}
              maxLength={2000}
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <Maximize className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
              <p className="text-body-lg font-bold text-gray-900">{p.surface_area ?? "–"}m²</p>
              <p className="text-caption text-gray-500">{t("surface")}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <Bed className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
              <p className="text-body-lg font-bold text-gray-900">{p.bedrooms ?? p.rooms ?? "–"}</p>
              <p className="text-caption text-gray-500">{t("bedrooms")}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <Bath className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
              <p className="text-body-lg font-bold text-gray-900">{p.bathrooms ?? "–"}</p>
              <p className="text-caption text-gray-500">{t("bathrooms")}</p>
            </div>
          </div>

          <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-4">
            <EditableTextField
              label={t("type")}
              value={typeLabels[p.property_type ?? ""] ?? p.property_type ?? ""}
              onSave={() => {}}
              saving={false}
            />
            <EditableNumberField label={t("surface")} value={p.surface_area} onSave={(v) => save({ surface_area: v })} saving={updateMutation.isPending} suffix="m²" min={1} max={10000} />
            <EditableNumberField label={t("rooms")} value={p.rooms} onSave={(v) => save({ rooms: v })} saving={updateMutation.isPending} min={1} max={50} />
            <EditableNumberField label={t("bedrooms")} value={p.bedrooms} onSave={(v) => save({ bedrooms: v })} saving={updateMutation.isPending} min={0} max={50} />
            <EditableNumberField label={t("bathrooms")} value={p.bathrooms} onSave={(v) => save({ bathrooms: v })} saving={updateMutation.isPending} min={0} max={20} />
            <EditableNumberField label={t("rent")} value={p.monthly_rent} onSave={(v) => save({ monthly_rent: v })} saving={updateMutation.isPending} suffix={tCommon("currency")} min={0} />
            <EditableNumberField label={t("deposit")} value={p.deposit} onSave={(v) => save({ deposit: v })} saving={updateMutation.isPending} suffix={tCommon("currency")} min={0} />
          </div>

          <PropertyEditSections property={p} onSave={save} saving={updateMutation.isPending} />

          <div className="mt-6 bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-body text-gray-500">{t("completion")}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${p.completion}%`,
                  backgroundColor: p.completion >= 70 ? "var(--brand-cyan)" : "var(--color-amber-400)",
                }}
              />
            </div>
            <span className="text-body font-bold text-gray-900">{p.completion}%</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 py-4 z-20">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            type="button"
            onClick={() => setConfirmAction("unpublish")}
            disabled={actionLoading}
            className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-body-md hover:border-gray-300 transition-colors outline-none"
          >
            {t("unpublish")}
          </button>
          <button
            type="button"
            onClick={() => setConfirmAction("delete")}
            disabled={actionLoading}
            className="w-14 h-14 rounded-2xl border-2 border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors outline-none"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-200 bg-black/40 flex items-end md:items-center justify-center" onClick={() => setConfirmAction(null)}>
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md px-6 py-6 space-y-4 animate-chat-slide-up" onClick={(e) => e.stopPropagation()}>
            <p className="text-body-lg font-bold text-gray-900 text-center">
              {confirmAction === "unpublish" ? t("unpublish") : t("delete")}
            </p>
            <p className="text-body text-gray-500 text-center">
              {confirmAction === "unpublish" ? t("confirmUnpublish") : t("confirmDelete")}
            </p>
            <button
              type="button"
              onClick={() => {
                if (confirmAction === "unpublish") unpublishMutation.mutate(p.id);
                else deleteMutation.mutate(p.id);
              }}
              disabled={actionLoading}
              className={`w-full py-3.5 rounded-2xl font-bold text-body-md text-white transition-colors outline-none ${
                confirmAction === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-brand-dark hover:bg-gray-800"
              }`}
            >
              {actionLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                confirmAction === "unpublish" ? t("unpublish") : t("delete")
              )}
            </button>
            <button
              type="button"
              onClick={() => setConfirmAction(null)}
              className="w-full py-3 text-gray-500 font-semibold text-body-md outline-none"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
