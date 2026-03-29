import Link from 'next/link';
import { ChevronLeft, Home } from "@/shared/ui/icons";

export default function HotePage() {
  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      <Link href="/profil" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      
      <div className="absolute inset-0 w-full h-full bg-white shadow-2xl flex flex-col animate-page-slide-right overflow-hidden border-l border-gray-100">
        
        <header className="px-4 py-4 border-b border-gray-100 flex items-center justify-start sticky top-0 bg-white z-10 w-full">
          <Link href="/profil" scroll={false} className="p-2 mr-3 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </Link>
          <h1 className="flex-1 font-bold text-gray-900 text-title-sm tracking-tight truncate">
            Proposer votre logement
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Héberger un switcher</h2>
            <p className="text-gray-500 font-medium">Le formulaire d&apos;ajout de logement arrivera très bientôt ici.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
