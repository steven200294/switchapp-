"use client";

import type { ReactNode } from "react";

type HorizontalSectionProps = {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
  children: ReactNode;
};

export default function HorizontalSection({ title, subtitle, action, children }: HorizontalSectionProps) {
  return (
    <section>
      <div className="flex items-end justify-between mb-4 px-6">
        <div>
          <h2 className="text-title-sm md:text-title-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-body-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="text-body-sm font-semibold text-brand-cyan hover:underline shrink-0"
          >
            {action.label}
          </button>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pl-6 pr-6 pb-2">
        {children}
      </div>
    </section>
  );
}
