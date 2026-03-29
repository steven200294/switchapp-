import Link from 'next/link';

export default function NotificationsPage() {
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
            Notifications
          </h1>

          <div className="space-y-8">
            
            {/* Section Push */}
            <div>
              <h2 className="text-title font-bold text-gray-900 mb-6">Notifications Push</h2>
              
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h3 className="text-body-lg font-bold text-gray-900 mb-1">Nouveaux messages</h3>
                    <p className="text-body text-gray-500 font-medium">Soyez notifié quand un hôte vous écrit.</p>
                  </div>
                  {/* Toggle On */}
                  <button className="w-12 h-6 rounded-full bg-green-500 relative transition-colors duration-300">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </button>
                </div>

                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h3 className="text-body-lg font-bold text-gray-900 mb-1">Nouveaux Switchs</h3>
                    <p className="text-body text-gray-500 font-medium">Un match ! Votre logement intéresse quelqu&apos;un que vous avez liké.</p>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-green-500 relative transition-colors duration-300">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* Section Email */}
            <div>
              <h2 className="text-title font-bold text-gray-900 mb-6">Notifications E-mail</h2>
              
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h3 className="text-body-lg font-bold text-gray-900 mb-1">Rappels de voyage</h3>
                    <p className="text-body text-gray-500 font-medium">Informations importantes avant votre départ.</p>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-green-500 relative transition-colors duration-300">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </button>
                </div>

                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h3 className="text-body-lg font-bold text-gray-900 mb-1">Promotions et recommandations</h3>
                    <p className="text-body text-gray-500 font-medium">Les meilleurs appartements de votre wishlist et astuces voyages.</p>
                  </div>
                  {/* Toggle Off */}
                  <button className="w-12 h-6 rounded-full bg-gray-200 relative transition-colors duration-300">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
