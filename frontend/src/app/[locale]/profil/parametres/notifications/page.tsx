"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Bell, MessageCircle, Heart, Zap } from "@/shared/ui/icons";

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

function NotifRow({ icon, title, description, active, onToggle }: {
  icon: React.ReactNode; title: string; description: string; active: boolean; onToggle: () => void;
}) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-600 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-body-md font-bold text-gray-900 mb-0.5">{title}</p>
        <p className="text-body-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
      <Toggle active={active} onToggle={onToggle} ariaLabel={title} />
    </div>
  );
}

export default function NotificationsPage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [notifs, setNotifs] = useState({
    messages: true,
    matches: true,
    reminders: true,
    promos: false,
    emailMessages: false,
    emailMatches: true,
  });

  const toggle = (key: keyof typeof notifs) => setNotifs((n) => ({ ...n, [key]: !n[key] }));

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <Link href="/profil/parametres" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        <header className="px-5 py-4 flex items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
          <Link href="/profil/parametres" scroll={false} aria-label={tCommon("back")} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-title-sm font-bold text-gray-900 ml-3">{t("notificationsTitle")}</h1>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 py-6 space-y-6">

          <section>
            <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{t("pushNotifs")}</p>
            <div className="divide-y divide-gray-100">
              <NotifRow icon={<MessageCircle size={18} aria-hidden />} title={t("notifPushNewMessages")} description={t("notifPushNewMessagesDesc")} active={notifs.messages} onToggle={() => toggle("messages")} />
              <NotifRow icon={<Heart size={18} aria-hidden />} title={t("notifPushNewMatches")} description={t("notifPushNewMatchesDesc")} active={notifs.matches} onToggle={() => toggle("matches")} />
              <NotifRow icon={<Bell size={18} aria-hidden />} title={t("notifPushReminders")} description={t("notifPushRemindersDesc")} active={notifs.reminders} onToggle={() => toggle("reminders")} />
              <NotifRow icon={<Zap size={18} aria-hidden />} title={t("notifPushPromos")} description={t("notifPushPromosDesc")} active={notifs.promos} onToggle={() => toggle("promos")} />
            </div>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <p className="text-body-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{t("emailNotifs")}</p>
            <div className="divide-y divide-gray-100">
              <NotifRow icon={<MessageCircle size={18} aria-hidden />} title={t("notifEmailMessages")} description={t("notifEmailMessagesDesc")} active={notifs.emailMessages} onToggle={() => toggle("emailMessages")} />
              <NotifRow icon={<Heart size={18} aria-hidden />} title={t("notifEmailMatches")} description={t("notifEmailMatchesDesc")} active={notifs.emailMatches} onToggle={() => toggle("emailMatches")} />
            </div>
          </section>
        </main>

        <div className="shrink-0 px-6 lg:px-10 py-5 border-t border-gray-100">
          <button
            className="w-full py-4 rounded-2xl font-bold text-body-md text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(90deg, var(--brand-cyan), var(--brand-purple))" }}
          >
            {t("savePreferences")}
          </button>
        </div>
      </div>
    </div>
  );
}
