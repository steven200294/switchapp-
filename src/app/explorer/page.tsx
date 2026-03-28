import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function ExplorerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-10 pb-6 relative z-0">
        <h1 className="text-[32px] md:text-4xl font-bold text-gray-900 mb-8 mt-2 md:mt-0 tracking-tight">Explorer</h1>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
