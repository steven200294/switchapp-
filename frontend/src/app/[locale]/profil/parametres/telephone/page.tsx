"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Smartphone, Check, Loader2 } from "@/shared/ui/icons";
import { useSendPhoneOtpMutation, useVerifyPhoneOtpMutation } from "@/shared/auth/hooks/useAuthMutations";

export default function PhoneVerificationPage() {
  const t = useTranslations("phoneVerification");
  const tCommon = useTranslations("common");

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+33");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code" | "done">("phone");

  const sendOtp = useSendPhoneOtpMutation();
  const verifyOtp = useVerifyPhoneOtpMutation();

  const isPending = sendOtp.isPending || verifyOtp.isPending;
  const error = sendOtp.error?.message || verifyOtp.error?.message || null;

  const handleSendCode = () => {
    if (!phone.trim()) return;
    sendOtp.mutate(
      { phone: phone.trim(), countryCode },
      { onSuccess: () => setStep("code") },
    );
  };

  const handleVerify = () => {
    if (code.length !== 4) return;
    verifyOtp.mutate(
      { phone: phone.trim(), code },
      { onSuccess: () => setStep("done") },
    );
  };

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      <Link href="/profil/parametres" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        <header className="px-5 py-4 flex items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
          <Link href="/profil/parametres" scroll={false} aria-label={tCommon("back")} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-title-sm font-bold text-gray-900 ml-3">{t("title")}</h1>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 py-8">
          <div className="max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-7 h-7 text-brand-cyan" />
            </div>

            <p className="text-body text-gray-500 text-center mb-8">{t("description")}</p>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-body font-medium rounded-2xl px-4 py-3 mb-6 text-center">
                {error}
              </div>
            )}

            {step === "phone" && (
              <div className="space-y-4">
                <div>
                  <label className="text-body-sm font-semibold text-gray-500 mb-1.5 block">{t("countryCode")}</label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-body text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
                  >
                    <option value="+33">+33</option>
                    <option value="+44">+44</option>
                    <option value="+49">+49</option>
                    <option value="+34">+34</option>
                    <option value="+39">+39</option>
                    <option value="+32">+32</option>
                    <option value="+41">+41</option>
                    <option value="+1">+1</option>
                  </select>
                </div>
                <div>
                  <label className="text-body-sm font-semibold text-gray-500 mb-1.5 block">{t("phoneLabel")}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("phonePlaceholder")}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-body text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isPending || !phone.trim()}
                  className="w-full py-3.5 rounded-2xl bg-black text-white font-bold text-body hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sendOtp.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {sendOtp.isPending ? t("sending") : t("sendCode")}
                </button>
              </div>
            )}

            {step === "code" && (
              <div className="space-y-4">
                <p className="text-body-sm text-brand-cyan font-medium text-center">{t("codeSent")}</p>
                <div>
                  <label className="text-body-sm font-semibold text-gray-500 mb-1.5 block">{t("codeLabel")}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder={t("codePlaceholder")}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-title text-center font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isPending || code.length !== 4}
                  className="w-full py-3.5 rounded-2xl bg-black text-white font-bold text-body hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {verifyOtp.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {verifyOtp.isPending ? t("verifying") : t("verify")}
                </button>
              </div>
            )}

            {step === "done" && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-title-sm font-bold text-gray-900">{t("verified")}</p>
                <Link
                  href="/profil/parametres"
                  className="inline-block py-3 px-8 rounded-2xl bg-black text-white font-bold text-body hover:bg-gray-800 transition-colors"
                >
                  {t("back")}
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
