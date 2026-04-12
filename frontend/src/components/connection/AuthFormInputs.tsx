import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { UserRound, Mail, Lock } from "@/shared/ui/icons";

interface AuthFormInputsProps {
  activeTab: "signin" | "signup";
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  fullName: string;
  setFullName: (v: string) => void;
}

export default function AuthFormInputs(p: AuthFormInputsProps) {
  const t = useTranslations("auth");

  return (
    <div className="w-full space-y-4 mb-6">
      {p.activeTab === "signup" && (
        <FormField
          icon={<UserRound size={22} strokeWidth={1.8} />}
          label={t("fullName")} type="text" value={p.fullName}
          onChange={p.setFullName} placeholder={t("namePlaceholder")}
        />
      )}
      <FormField
        icon={<Mail size={22} strokeWidth={1.8} />}
        label={t("email")} type="email" value={p.email}
        onChange={p.setEmail} placeholder={t("emailPlaceholder")} autoComplete="email"
      />
      <FormField
        icon={<Lock size={22} strokeWidth={1.8} />}
        label={t("password")} type="password" value={p.password}
        onChange={p.setPassword} placeholder={t("passwordPlaceholder")}
        autoComplete={p.activeTab === "signin" ? "current-password" : "new-password"} tracking
      />
      {p.activeTab === "signup" && (
        <FormField
          icon={<Lock size={22} strokeWidth={1.8} />}
          label={t("confirmPassword")} type="password" value={p.confirmPassword}
          onChange={p.setConfirmPassword} placeholder={t("passwordPlaceholder")} autoComplete="new-password" tracking
        />
      )}
    </div>
  );
}

function FormField({ icon, label, type, value, onChange, placeholder, autoComplete, tracking }: {
  icon: ReactNode; label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string; autoComplete?: string; tracking?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-2xl flex items-center p-2 bg-white shadow-sm focus-within:border-gray-300 transition-colors">
      <div className="w-12 h-12 flex items-center justify-center text-black shrink-0">
        {icon}
      </div>
      <div className="w-px h-8 bg-gray-200 shrink-0 mx-1" />
      <div className="flex-1 flex flex-col justify-center pl-3 pr-2">
        <label className="text-body-xs text-gray-500 font-medium mb-0.5">{label}</label>
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          autoComplete={autoComplete}
          className={`text-body font-bold text-black outline-none bg-transparent w-full placeholder:font-normal placeholder:text-gray-300${tracking ? " tracking-widest" : ""}`}
        />
      </div>
    </div>
  );
}
