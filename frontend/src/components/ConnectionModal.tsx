"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "@/shared/ui/icons";
import { loginUser, registerUser } from "@/shared/auth/services/auth.service";
import { useAuthStore } from "@/shared/stores/auth.store";
import DecorativeBubbles from "./connection/DecorativeBubbles";
import AuthFormHeader from "./connection/AuthFormHeader";
import AuthFormInputs from "./connection/AuthFormInputs";
import SocialLoginButtons from "./connection/SocialLoginButtons";
import AuthFormFooter from "./connection/AuthFormFooter";

export default function ConnectionModal({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 300); };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError("Veuillez remplir tous les champs."); return; }
    if (activeTab === "signup" && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const result = activeTab === "signin"
        ? await loginUser({ email, password })
        : await registerUser({ email, password, full_name: fullName });
      setAuth(result.user, result.token);
      handleClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally { setLoading(false); }
  }

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
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-2 rounded-full z-50" aria-label="Fermer">
          <X className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col items-center pt-12 pb-8 px-6 w-full max-w-md mx-auto overflow-y-auto overflow-x-hidden scrollbar-hide max-h-[88vh] relative z-10">
          <AuthFormHeader activeTab={activeTab} />
          <div className="bg-gray-100 p-[5px] rounded-2xl flex w-full mb-8">
            <button type="button" onClick={() => { setActiveTab("signin"); setError(null); }} className={`flex-1 py-3 text-center text-[15px] font-semibold rounded-xl transition-all ${activeTab === "signin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Connexion</button>
            <button type="button" onClick={() => { setActiveTab("signup"); setError(null); }} className={`flex-1 py-3 text-center text-[15px] font-semibold rounded-xl transition-all ${activeTab === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Inscription</button>
          </div>
          {error && <div className="w-full bg-red-50 border border-red-100 text-red-600 text-[14px] font-medium rounded-2xl px-4 py-3 mb-4 text-center">{error}</div>}
          <AuthFormInputs activeTab={activeTab} email={email} setEmail={setEmail} password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} fullName={fullName} setFullName={setFullName} />
          <button type="submit" disabled={loading} className="w-full rounded-full bg-linear-to-r from-brand-cyan to-brand-purple text-white font-black py-4 text-body-lg shadow-[0_0_14px_rgba(0,191,255,0.35),0_0_14px_rgba(138,43,226,0.35)] hover:shadow-[0_0_22px_rgba(0,191,255,0.5),0_0_22px_rgba(138,43,226,0.5)] transition-shadow mb-8 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>{activeTab === "signin" ? "Connexion..." : "Création..."}</span></> : activeTab === "signin" ? "Se connecter" : "Créer un compte"}
          </button>
          <SocialLoginButtons />
          <AuthFormFooter activeTab={activeTab} setActiveTab={setActiveTab} setError={setError} />
        </form>
      </div>
    </div>
  );
}
