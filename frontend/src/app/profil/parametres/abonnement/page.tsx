import Link from 'next/link';

export default function AbonnementPage() {
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
            Mon Abonnement
          </h1>

          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="url(#free-grad)" className="w-10 h-10 opacity-60">
                <defs>
                  <linearGradient id="free-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9CA3AF" />
                    <stop offset="100%" stopColor="#6B7280" />
                  </linearGradient>
                </defs>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            
            <h2 className="text-title-md font-bold text-gray-900 mb-2">Switch Gratuit</h2>
            <p className="text-body-md font-medium text-gray-500 mb-10 text-center max-w-sm">
              Vous êtes actuellement sur l&apos;offre gratuite. Swiper et discuter est toujours 100% gratuit !
            </p>

            <div className="w-full bg-brand-dark p-6 lg:p-8 rounded-3xl relative overflow-hidden group border border-white/10 shadow-2xl text-left">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <svg viewBox="0 0 24 24" fill="url(#premium-grad-sub)" className="w-6 h-6">
                    <defs>
                      <linearGradient id="premium-grad-sub" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--brand-cyan)" />
                        <stop offset="100%" stopColor="var(--brand-purple)" />
                      </linearGradient>
                    </defs>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h4 className="text-title-md md:text-display-xs font-bold text-white leading-tight mb-4 tracking-tight">
                  Passez à<br/><span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-brand-purple">SwitchPremium</span>
                </h4>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300 text-body-md font-medium">
                     <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 text-brand-cyan"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span> 
                     Likes illimités sans restriction
                  </li>
                  <li className="flex items-center text-gray-300 text-body-md font-medium">
                     <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 text-brand-cyan"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span> 
                     Découvrez qui vous a liké
                  </li>
                  <li className="flex items-center text-gray-300 text-body-md font-medium">
                     <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 text-brand-cyan"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span> 
                     5 Super-Switchs inclus par semaine
                  </li>
                  <li className="flex items-center text-gray-300 text-body-md font-medium">
                     <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 text-brand-cyan"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span> 
                     1 Boost mensuel pour décupler vos vues
                  </li>
                </ul>
              </div>
              
              <button className="relative z-10 bg-white w-full text-black px-4 py-4 rounded-[14px] font-black text-body-md transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand-purple/25">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-brand-purple">S&apos;abonner à partir de 9,99€ / mois</span>
              </button>
              
              {/* Lueur d'ambiance Premium */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-linear-to-br from-brand-cyan/20 via-brand-purple/20 to-transparent rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none"></div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
