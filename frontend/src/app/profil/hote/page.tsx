import Link from 'next/link';

export default function HotePage() {
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
            Proposer votre logement
          </h1>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto w-full px-6 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Héberger un switcher</h2>
            <p className="text-gray-500 font-medium">Le formulaire d&apos;ajout de logement arrivera très bientôt ici.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
