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
  return (
    <div className="w-full space-y-4 mb-6">
      {p.activeTab === "signup" && (
        <FormField
          icon={<><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></>}
          label="Nom complet" type="text" value={p.fullName}
          onChange={p.setFullName} placeholder="Jean Dupont"
        />
      )}
      <FormField
        icon={<><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 7l9 6 9-6" /></>}
        label="Adresse email" type="email" value={p.email}
        onChange={p.setEmail} placeholder="votre@email.com" autoComplete="email"
      />
      <FormField
        icon={<><rect x="3" y="11" width="18" height="11" rx="3" /><path d="M7 11V7a5 5 0 0110 0v4" /></>}
        label="Mot de passe" type="password" value={p.password}
        onChange={p.setPassword} placeholder="••••••••"
        autoComplete={p.activeTab === "signin" ? "current-password" : "new-password"} tracking
      />
      {p.activeTab === "signup" && (
        <FormField
          icon={<><rect x="3" y="11" width="18" height="11" rx="3" /><path d="M7 11V7a5 5 0 0110 0v4" /></>}
          label="Confirmer le mot de passe" type="password" value={p.confirmPassword}
          onChange={p.setConfirmPassword} placeholder="••••••••" autoComplete="new-password" tracking
        />
      )}
    </div>
  );
}

function FormField({ icon, label, type, value, onChange, placeholder, autoComplete, tracking }: {
  icon: React.ReactNode; label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string; autoComplete?: string; tracking?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-2xl flex items-center p-2 bg-white shadow-sm focus-within:border-gray-300 transition-colors">
      <div className="w-12 h-12 flex items-center justify-center text-black shrink-0">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      </div>
      <div className="w-px h-8 bg-gray-200 shrink-0 mx-1" />
      <div className="flex-1 flex flex-col justify-center pl-3 pr-2">
        <label className="text-[11px] text-gray-500 font-medium mb-0.5">{label}</label>
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          autoComplete={autoComplete}
          className={`text-[14px] font-bold text-black outline-none bg-transparent w-full placeholder:font-normal placeholder:text-gray-300${tracking ? " tracking-widest" : ""}`}
        />
      </div>
    </div>
  );
}
