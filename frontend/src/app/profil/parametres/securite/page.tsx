import Link from 'next/link';

export default function SecuritePage() {
  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      <Link href="/profil/parametres" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      
      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        
        <header className="px-5 py-4 flex items-center justify-start sticky top-0 bg-white/95 backdrop-blur-sm z-10 w-full mb-2">
          <Link href="/profil/parametres" scroll={false} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 pb-12">
          <h1 className="text-display font-bold text-gray-900 tracking-tight mb-8">
            Connexion et sécurité
          </h1>

          <div className="space-y-8">
            
            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-title-sm font-bold text-gray-900">Mot de passe</h3>
                <button className="text-body font-bold text-brand-purple hover:underline">Modifier</button>
              </div>
              <p className="text-body text-gray-500 font-medium">Dernière mise à jour il y a 3 mois</p>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* 2FA */}
            <div>
              <div className="flex items-start justify-between">
                <div className="pr-4">
                  <h3 className="text-title-sm font-bold text-gray-900 mb-1">Authentification à deux facteurs</h3>
                  <p className="text-body text-gray-500 font-medium leading-relaxed">
                    Renforcez la sécurité de votre compte SwitchAppart en demandant un code supplémentaire lors de chaque connexion.
                  </p>
                </div>
                <div className="shrink-0 pt-1">
                  {/* Toggle Switch Off */}
                  <button className="w-12 h-6 rounded-full bg-gray-200 relative transition-colors duration-300">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* Appareils */}
            <div>
              <h3 className="text-title-sm font-bold text-gray-900 mb-4">Appareils connectés</h3>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-gray-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                </div>
                <div className="flex-1">
                  <p className="text-body-md font-bold text-gray-900">iPhone 14 Pro Max</p>
                  <p className="text-body-sm font-medium text-green-500">Actif en ce moment • Paris, FR</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
