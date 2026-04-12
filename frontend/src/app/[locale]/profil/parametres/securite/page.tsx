"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { KeyRound, Smartphone, Shield } from "@/shared/ui/icons";

function Toggle({ active, onToggle, ariaLabel }: { active: boolean; onToggle: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ${active ? "bg-gray-900" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${active ? "translate-x-6" : "translate-x-0"}`} />
    </button>
  );
}

function SettingRow({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-5">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-600 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-body-md font-bold text-gray-900 mb-0.5">{title}</p>
        <p className="text-body-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0 pt-1">{action}</div>
    </div>
  );
}

export default function SecuritePage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [twoFA, setTwoFA] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  const devices = [
    { name: t("secDevicePhone"), location: t("secDeviceLocation1"), active: true as const },
    { name: t("secDeviceLaptop"), location: t("secDeviceLocation2"), active: false as const },
  ];

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <Link href="/profil/parametres" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        <header className="px-5 py-4 flex items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
          <Link href="/profil/parametres" scroll={false} aria-label={tCommon("back")} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-title-sm font-bold text-gray-900 ml-3">{t("security")}</h1>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 py-6">

          {/* Mot de passe */}
          <section>
            <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{t("password")}</p>
            <SettingRow
              icon={<KeyRound size={18} />}
              title={t("changePassword")}
              description={t("lastUpdate")}
              action={
                <button type="button" onClick={() => setShowPasswordForm(!showPasswordForm)} className="text-body-sm font-bold text-gray-900 hover:underline">
                  {showPasswordForm ? t("changePasswordCancel") : t("changePasswordEdit")}
                </button>
              }
            />
            {showPasswordForm && (
              <div className="mt-2 mb-4 space-y-3 animate-fade-in">
                {[
                  { label: t("currentPassword"), key: "current" },
                  { label: t("newPassword"), key: "next" },
                  { label: t("confirmNew"), key: "confirm" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="text-body-sm font-semibold text-gray-500 mb-1.5 block">{label}</label>
                    <input
                      type="password"
                      value={passwords[key as keyof typeof passwords]}
                      onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-body text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-cyan transition-all"
                    />
                  </div>
                ))}
                <button type="button" className="w-full py-3.5 rounded-2xl bg-black text-white font-bold text-body hover:bg-gray-800 transition-colors mt-2">
                  {tCommon("update")}
                </button>
              </div>
            )}
          </section>

          <div className="h-px bg-gray-100 my-2" />

          {/* 2FA */}
          <section>
            <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{t("securitySection")}</p>
            <SettingRow
              icon={<Shield size={18} />}
              title={t("twoFactor")}
              description={t("twoFactorDescLong")}
              action={<Toggle active={twoFA} onToggle={() => setTwoFA(!twoFA)} ariaLabel={t("twoFactor")} />}
            />
          </section>

          <div className="h-px bg-gray-100 my-2" />

          {/* Appareils */}
          <section>
            <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t("connectedDevices")}</p>
            <div className="space-y-3">
              {devices.map((device) => (
                <div key={device.name} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-gray-500">
                    <Smartphone size={18} aria-hidden />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md font-bold text-gray-900">{device.name}</p>
                    <p className={`text-body-sm font-medium ${device.active ? "text-green-500" : "text-gray-400"}`}>
                      {device.active ? t("secDeviceActivePrefix") : ""}{device.location}
                    </p>
                  </div>
                  {!device.active && (
                    <button type="button" className="text-body-sm font-bold text-red-400 hover:text-red-600 transition-colors">{t("disconnect")}</button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
