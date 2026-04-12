"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight } from "@/shared/ui/icons";

interface SeeAllCardProps {
  label: string;
  categoryTitle: string;
  total: number;
  href: string;
}

export default function SeeAllCard({ label, categoryTitle, total, href }: SeeAllCardProps) {
  return (
    <Link
      href={href}
      className="group relative shrink-0 w-[240px] md:w-[270px] snap-start flex flex-col"
    >
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-cyan bg-gray-50 hover:bg-brand-cyan/5 transition-all cursor-pointer aspect-4/3 mb-2.5">
        <div className="w-14 h-14 rounded-full bg-brand-cyan/10 flex items-center justify-center mb-4 group-hover:bg-brand-cyan/20 transition-colors">
          <ArrowRight className="w-6 h-6 text-brand-cyan" />
        </div>
        <span className="font-bold text-body-lg text-gray-900 mb-1">{label}</span>
        <span className="text-body-sm text-gray-500 text-center px-4 line-clamp-2">
          {categoryTitle}
        </span>
      </div>
    </Link>
  );
}
