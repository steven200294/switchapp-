import Link from 'next/link';

export default function ParrainagePage() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end items-center">
      <Link href="/profil" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      
      <div className="relative w-full md:max-w-xl h-[90vh] md:h-[80vh] bg-white rounded-t-3xl md:rounded-3xl md:mb-10 shadow-2xl flex flex-col animate-page-slide-up overflow-hidden">
        <div className="w-full flex justify-center pt-3 pb-2 md:hidden">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <header className="px-4 py-2 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 w-full">
          <div className="w-10"></div>
          <h1 className="flex-1 text-center font-bold text-gray-900 text-body-xl tracking-tight truncate px-2">
            Parrainer un ami
          </h1>
          <Link href="/profil" scroll={false} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900 flex items-center justify-center w-10 h-10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Gagnez des avantages</h2>
            <p className="text-gray-500 font-medium">Le programme de parrainage SwitchAppart sera activé dans une prochaine mise à jour !</p>
          </div>
        </main>
      </div>
    </div>
  );
}
