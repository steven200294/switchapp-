import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function FavorisPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white pb-20 md:pb-0">
      <div className="hidden md:block">
        <Header />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Favoris</h1>
        <p className="text-gray-500">Toutes tes annonces coup de cœur apparaîtront ici.</p>
      </main>
      <BottomNav />
    </div>
  );
}
