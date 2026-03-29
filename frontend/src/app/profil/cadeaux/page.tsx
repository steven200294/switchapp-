import Link from 'next/link';

export default function CadeauxPage() {
  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      {/* Fond sombre cliquable pour fermer */}
      <Link href="/profil" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      
      {/* Page complète (glisse de la droite) */}
      <div className="absolute inset-0 w-full h-full bg-white shadow-2xl flex flex-col animate-page-slide-right overflow-hidden border-l border-gray-100">
        
        {/* Header Modale */}
        <header className="px-4 py-4 border-b border-gray-100 flex items-center justify-start sticky top-0 bg-white z-10 w-full">
          <Link href="/profil" scroll={false} className="p-2 mr-3 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="flex-1 font-bold text-gray-900 text-title-sm tracking-tight truncate">
            Cartes cadeaux
          </h1>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto w-full px-6 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Gérez vos cartes</h2>
            <p className="text-gray-500 font-medium">Offrez ou recevez des mois d&apos;abonnements SwitchPremium à vos proches.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
