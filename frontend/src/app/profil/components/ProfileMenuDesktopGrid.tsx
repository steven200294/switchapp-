"use client";

import Link from "next/link";
import type { ProfileMenuItem } from "../types/profile-menu-types";

export default function ProfileMenuDesktopGrid({ items }: { items: ProfileMenuItem[] }) {
  const base =
    "group flex flex-col items-start p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all text-left h-full";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => {
        const Icon = item.icon;
        if (item.isDestructive) {
          return (
            <button type="button" key={item.id} onClick={() => item.action?.()} className={`${base} hover:border-red-200`}>
              <Icon className="w-8 h-8 mb-5 text-red-500" />
              <h3 className="text-body-xl font-bold mb-2 text-red-500">{item.label}</h3>
              <p className="text-body text-gray-500 leading-relaxed font-medium">{item.description}</p>
            </button>
          );
        }
        const body = (
          <>
            <Icon className="w-8 h-8 mb-5 text-gray-900" />
            <h3 className="text-body-xl font-bold mb-2 text-gray-900">{item.label}</h3>
            <p className="text-body text-gray-500 leading-relaxed font-medium">{item.description}</p>
          </>
        );
        return item.href ? (
          <Link key={item.id} href={item.href} className={`${base} hover:border-gray-300`}>
            {body}
          </Link>
        ) : (
          <button type="button" key={item.id} onClick={() => item.action?.()} className={`${base} hover:border-gray-300`}>
            {body}
          </button>
        );
      })}
    </div>
  );
}
