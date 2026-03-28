import Link from 'next/link';

export default function ConfidentialitePage() {
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <Link href="/profil" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      
      <div className="absolute inset-0 w-full h-full bg-white shadow-2xl flex flex-col animate-page-slide-right overflow-hidden border-l border-gray-100">
        
        <header className="px-4 py-4 border-b border-gray-100 flex items-center justify-start sticky top-0 bg-white z-10 w-full">
          <Link href="/profil" scroll={false} className="p-2 mr-3 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="flex-1 font-bold text-gray-900 text-[18px] tracking-tight truncate">
            Confidentialité
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sécurité et Données</h2>
            <p className="text-gray-500 font-medium pb-24 md:pb-0">Gère ici tout ce qui concerne tes données personnelles et la confidentialité liées à l'application.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
