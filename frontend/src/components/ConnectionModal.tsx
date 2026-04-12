"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Loader2, X } from "@/shared/ui/icons";
import { useLoginMutation, useRegisterMutation } from "@/shared/auth/hooks/useAuthMutations";
import DecorativeBubbles from "./connection/DecorativeBubbles";
import AuthFormHeader from "./connection/AuthFormHeader";
import AuthFormInputs from "./connection/AuthFormInputs";
import SocialLoginButtons from "./connection/SocialLoginButtons";
import AuthFormFooter from "./connection/AuthFormFooter";
import ProposeModal from "./ProposeModal";
import OnboardingModal from "./OnboardingModal";

const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? "";

export default function ConnectionModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [postAuthFlow, setPostAuthFlow] = useState<"none" | "onboarding" | "propose">("none");
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const captchaRef = useRef<TurnstileInstance>(null);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const isPending = loginMutation.isPending || registerMutation.isPending;
  const serverError = loginMutation.error?.message || registerMutation.error?.message || null;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 300); };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClientError(null);
    loginMutation.reset();
    registerMutation.reset();

    if (!email || !password) { setClientError(t("fillAllFields")); return; }

    if (activeTab === "signup") {
      if (fullName.trim().length < 2) { setClientError(t("nameMinLength")); return; }
      if (password.length < 8) { setClientError(t("passwordMinLength")); return; }
      if (password !== confirmPassword) { setClientError(t("passwordMismatch")); return; }

      const token = captchaToken || "dev-bypass";
      if (!token) { setClientError(t("genericError")); return; }

      registerMutation.mutate(
        { email, password, full_name: fullName.trim(), captcha_token: token },
        {
          onSuccess: () => setPostAuthFlow("onboarding"),
          onError: () => { captchaRef.current?.reset(); setCaptchaToken(""); },
        },
      );
    } else {
      loginMutation.mutate(
        { email, password },
        { onSuccess: () => setPostAuthFlow("propose") },
      );
    }
  }

  if (postAuthFlow === "onboarding") return <OnboardingModal onClose={handleClose} />;
  if (postAuthFlow === "propose") return <ProposeModal onClose={handleClose} />;

  const displayError = clientError || serverError;

  return (
    <div className="fixed inset-0 z-540 flex flex-col justify-end pointer-events-none overflow-hidden">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 pointer-events-auto ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />
      <div
        className="w-full bg-white border-t border-gray-200 shadow-2xl transition-transform duration-300 ease-out min-h-[90vh] rounded-t-[3rem] relative pointer-events-auto overflow-hidden"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        <DecorativeBubbles />
        <button type="button" onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-2 rounded-full z-50" aria-label={tCommon("close")}>
          <X className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col items-center pt-12 pb-8 px-6 w-full max-w-md mx-auto overflow-y-auto overflow-x-hidden scrollbar-hide max-h-[88vh] relative z-10">
          <AuthFormHeader activeTab={activeTab} />
          <div className="bg-gray-100 p-[5px] rounded-2xl flex w-full mb-8">
            <button type="button" onClick={() => { setActiveTab("signin"); setClientError(null); loginMutation.reset(); registerMutation.reset(); }} className={`flex-1 py-3 text-center text-body-md font-semibold rounded-xl transition-all ${activeTab === "signin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{t("login")}</button>
            <button type="button" onClick={() => { setActiveTab("signup"); setClientError(null); loginMutation.reset(); registerMutation.reset(); }} className={`flex-1 py-3 text-center text-body-md font-semibold rounded-xl transition-all ${activeTab === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{t("register")}</button>
          </div>
          {displayError && <div className="w-full bg-red-50 border border-red-100 text-red-600 text-body font-medium rounded-2xl px-4 py-3 mb-4 text-center">{displayError}</div>}
          <AuthFormInputs activeTab={activeTab} email={email} setEmail={setEmail} password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} fullName={fullName} setFullName={setFullName} />

          {activeTab === "signup" && CAPTCHA_SITE_KEY && (
            <div className="w-full mb-4">
              <Turnstile
                ref={captchaRef}
                siteKey={CAPTCHA_SITE_KEY}
                onSuccess={setCaptchaToken}
                onError={() => setCaptchaToken("")}
                onExpire={() => setCaptchaToken("")}
                options={{ theme: "light", size: "flexible" }}
              />
            </div>
          )}

          <button type="submit" disabled={isPending} className="w-full rounded-full bg-linear-to-r from-brand-cyan to-brand-purple text-white font-black py-4 text-body-lg shadow-[0_0_14px_rgba(0,191,255,0.35),0_0_14px_rgba(138,43,226,0.35)] hover:shadow-[0_0_22px_rgba(0,191,255,0.5),0_0_22px_rgba(138,43,226,0.5)] transition-shadow mb-8 flex items-center justify-center gap-2 disabled:opacity-50">
            {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /><span>{activeTab === "signin" ? t("loggingIn") : t("registering")}</span></> : activeTab === "signin" ? t("submitLogin") : t("submitRegister")}
          </button>
          <SocialLoginButtons />
          <AuthFormFooter activeTab={activeTab} setActiveTab={setActiveTab} setError={setClientError} />
        </form>
      </div>
    </div>
  );
}
