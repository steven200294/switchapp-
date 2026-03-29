import Link from "next/link";
import { ChevronLeft, ChevronRight } from "@/shared/ui/icons";
import { SETTINGS_SECTIONS } from "@/app/profil/constants/settings-sections";

export default function ParametresPage() {
  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      <Link href="/profil" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        <header className="px-5 py-4 flex items-center justify-start sticky top-0 bg-white/95 backdrop-blur-sm z-10 w-full mb-2">
          <Link href="/profil" scroll={false} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 pb-12">
          <h1 className="text-display font-bold text-gray-900 tracking-tight mb-8">Paramètres du compte</h1>

          <div className="flex flex-col">
            {SETTINGS_SECTIONS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                scroll={false}
                className="w-full flex items-center justify-between py-[22px] group"
              >
                <div className="flex items-center gap-5">
                  <div className="text-gray-900">{item.icon}</div>
                  <span className="text-body-xl text-gray-900 text-left">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-gray-300" strokeWidth={2.5} />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
