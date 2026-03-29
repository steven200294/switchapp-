interface PropertyBottomBarProps {
  monthlyRent: number;
}

export default function PropertyBottomBar({ monthlyRent }: PropertyBottomBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 md:px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 flex justify-center"
      style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
    >
      <div className="w-full max-w-3xl flex items-center justify-between gap-4">
        <div>
          <span className="text-title-md font-black text-gray-900">{monthlyRent}€</span>
          <span className="text-gray-500 text-body"> /mois</span>
        </div>
        <button
          type="button"
          className="px-8 py-4 bg-linear-to-r from-brand-cyan to-brand-purple text-white rounded-2xl font-bold text-body-lg hover:scale-[1.02] transition-transform shadow-xl shadow-brand-purple/20"
        >
          Proposer un Switch
        </button>
      </div>
    </div>
  );
}
