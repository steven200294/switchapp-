import Link from 'next/link';
import { ChevronLeft } from "@/shared/ui/icons";

export default function InformationsPage() {
  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      <Link href="/profil/parametres" scroll={false} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      
      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:left-auto md:w-full md:max-w-2xl h-full bg-white shadow-2xl flex flex-col md:animate-page-slide-right animate-page-slide-up overflow-hidden">
        
        <header className="px-5 py-4 flex items-center justify-start sticky top-0 bg-white/95 backdrop-blur-sm z-10 w-full mb-2">
          <Link href="/profil/parametres" scroll={false} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center w-10 h-10 shrink-0">
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-6 lg:px-10 pb-12">
          <h1 className="text-display font-bold text-gray-900 tracking-tight mb-8">
            Informations personnelles
          </h1>

          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-body font-bold text-gray-900 mb-2">Prénom et Nom</label>
              <input type="text" defaultValue="Kuti" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all" />
            </div>

            <div className="flex flex-col">
              <label className="text-body font-bold text-gray-900 mb-2">Adresse E-mail</label>
              <input type="email" defaultValue="kuti@switchappart.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all" />
            </div>

            <div className="flex flex-col">
              <label className="text-body font-bold text-gray-900 mb-2">Numéro de téléphone</label>
              <div className="flex gap-3">
                <input type="text" defaultValue="+33" className="w-[80px] text-center px-4 py-3 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900" />
                <input type="tel" defaultValue="6 12 34 56 78" className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-body font-bold text-gray-900 mb-2">Adresse postale</label>
              <input type="text" defaultValue="Paris, France" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-body-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all" />
              <p className="text-body-sm text-gray-500 font-medium mt-3 leading-relaxed">
                Votre adresse exacte ne sera jamais partagée avec les autres utilisateurs avant la validation concrète d&apos;un Switch.
              </p>
            </div>
            
            <button className="w-full py-4 mt-8 bg-gray-900 text-white rounded-[14px] font-bold text-body-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md">
              Enregistrer
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
