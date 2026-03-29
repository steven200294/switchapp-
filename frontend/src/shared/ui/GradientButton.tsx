import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "px-4 py-2 text-body-sm",
  md: "px-6 py-3 text-body",
  lg: "px-8 py-4 text-body-lg",
} as const;

export default function GradientButton({ children, size = "md", className = "", ...props }: GradientButtonProps) {
  return (
    <button
      className={`bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-60 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
