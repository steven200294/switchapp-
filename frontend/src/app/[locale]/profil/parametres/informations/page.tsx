"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useMyProfile, useUpdateProfileMutation } from "@/shared/auth/hooks/useAuthMutations";
import { useAuthStore } from "@/shared/stores/auth.store";
import SavedCheck from "./SavedCheck";

export default function InformationsPage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { isLoggedIn, user } = useAuthStore();
  const { data: profile } = useMyProfile(isLoggedIn);
  const mutation = useUpdateProfileMutation();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    profession: "",
    bio: "",
  });
  const [savedField, setSavedField] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      const p = profile as Record<string, unknown>;
      setForm({
        full_name: (p.full_name as string) ?? user?.full_name ?? "",
        email: user?.email ?? "",
        phone: (p.phone_number as string) ?? "",
        city: (p.city as string) ?? "",
        profession: (p.profession as string) ?? "",
        bio: (p.bio as string) ?? "",
      });
    }
  }, [profile, user]);

  function saveField(field: string, value: string) {
    if (!value && !form[field as keyof typeof form]) return;
    mutation.mutate(
      { [field]: value },
      {
        onSuccess: () => {
          setSavedField(field);
          setTimeout(() => setSavedField(null), 2000);
        },
      },
    );
  }

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      <Link href="/profil/parametres" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        <header className="px-5 py-4 flex items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
          <Link href="/profil/parametres" scroll={false} aria-label={tCommon("back")} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-title-sm font-bold text-gray-900 ml-3">{t("personalInfo")}</h1>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 py-8 space-y-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={t("editPhoto")} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-display font-bold text-gray-300">
                  {form.full_name?.[0] ?? "?"}
                </div>
              )}
            </div>
            <div>
              <button type="button" className="text-body-md font-bold text-gray-900 hover:underline">{t("editPhoto")}</button>
              <p className="text-body-sm text-gray-400 mt-0.5">{t("photoHint")}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-5">
            <FieldRow
              label={t("firstName")}
              value={form.full_name}
              onChange={(v) => setForm({ ...form, full_name: v })}
              onBlur={() => saveField("full_name", form.full_name)}
              placeholder={t("namePlaceholder")}
              saved={savedField === "full_name"}
            />

            <div>
              <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">{t("email")}</label>
              <input
                type="email"
                value={form.email}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-body-lg text-gray-500 focus:outline-none cursor-not-allowed"
                disabled
              />
              <p className="text-body-sm text-gray-400 mt-2">{t("emailReadonly")}</p>
            </div>

            <FieldRow
              label={t("phone")}
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              onBlur={() => saveField("phone", form.phone)}
              placeholder={t("phonePlaceholder")}
              type="tel"
              saved={savedField === "phone"}
            />

            <FieldRow
              label={t("cityLabel")}
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
              onBlur={() => saveField("city", form.city)}
              placeholder={t("cityPlaceholder")}
              hint={t("informationCityHint")}
              saved={savedField === "city"}
            />

            <FieldRow
              label={t("profession")}
              value={form.profession}
              onChange={(v) => setForm({ ...form, profession: v })}
              onBlur={() => saveField("profession", form.profession)}
              placeholder={t("professionPlaceholder")}
              saved={savedField === "profession"}
            />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest">{t("bio")}</label>
                <SavedCheck visible={savedField === "bio"} />
              </div>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                onBlur={() => saveField("bio", form.bio)}
                placeholder={t("bioPlaceholder")}
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-cyan transition-all resize-none"
              />
              <p className="text-body-xs text-gray-400 text-right mt-1">{form.bio.length}/500</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function FieldRow({ label, value, onChange, onBlur, placeholder, type = "text", hint, saved }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  saved?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-body-sm font-bold text-gray-500 uppercase tracking-widest">{label}</label>
        <SavedCheck visible={!!saved} />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-cyan transition-all"
        placeholder={placeholder}
      />
      {hint && <p className="text-body-sm text-gray-400 mt-2">{hint}</p>}
    </div>
  );
}
