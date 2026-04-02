import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outlined";
}

const paddings = {
  sm: "px-5 py-2 text-body-sm",
  md: "px-6 py-3 text-body",
  lg: "px-8 py-4 text-body-lg",
} as const;

export default function GradientButton({
  children,
  size = "md",
  variant = "filled",
  className = "",
  ...props
}: GradientButtonProps) {
  const glow =
    "shadow-[0_0_14px_rgba(0,191,255,0.35),0_0_14px_rgba(138,43,226,0.35)]";

  if (variant === "outlined") {
    return (
      <button
        className={`group relative rounded-full p-[2px] bg-linear-to-r from-brand-purple to-brand-cyan ${glow} hover:shadow-[0_0_22px_rgba(0,191,255,0.5),0_0_22px_rgba(138,43,226,0.5)] transition-shadow disabled:opacity-50 ${className}`}
        {...props}
      >
        <span
          className={`flex items-center justify-center gap-2 rounded-full bg-brand-dark text-white font-bold ${paddings[size]} transition-colors group-hover:bg-brand-dark-alt`}
        >
          {children}
        </span>
      </button>
    );
  }

  return (
    <button
      className={`rounded-full bg-linear-to-r from-brand-cyan to-brand-purple text-white font-bold ${glow} hover:shadow-[0_0_22px_rgba(0,191,255,0.5),0_0_22px_rgba(138,43,226,0.5)] transition-shadow disabled:opacity-50 flex items-center justify-center gap-2 ${paddings[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
