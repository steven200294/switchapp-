import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

// --- Mock Data ---
const mockConversations = [
  {
    id: 1,
    name: "Thomas Dubois",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=150&q=80",
    lastMessage: "Salut ! Ton appartement à Paris a l'air super, on pourrait échanger sur les dates ?",
    time: "14:32",
    unread: true,
    status: "Demande reçue",
  },
  {
    id: 2,
    name: "Émilie Laurent",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&q=80",
    lastMessage: "C'est confirmé pour le 15 août. J'ai hâte, merci encore ! On se capte à l'arrivée.",
    time: "Hier",
    unread: false,
    status: "Échange confirmé",
  },
  {
    id: 3,
    name: "Lucas & Chloé",
    avatar: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?fit=crop&w=150&q=80",
    lastMessage: "Bonjour, est-ce que le quartier est calme le soir ? Nous cherchons un endroit reposant.",
    time: "Lun.",
    unread: false,
    status: "",
  },
  {
    id: 4,
    name: "Marie Silva",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&q=80",
    lastMessage: "Merci pour les infos. Je regarde ça et je vous tiens au courant très rapidement.",
    time: "12 Mar",
    unread: false,
    status: "",
  }
];

export default function MessagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
      {/* Header Desktop */}
      <div className="hidden md:block border-b border-gray-100">
        <Header />
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-10 pb-6">
        {/* En-tête de la page */}
        <h1 className="text-[32px] md:text-4xl font-bold text-gray-900 mb-8 mt-2 md:mt-0 tracking-tight">Messages</h1>
        
        {/* Filtres de conversation */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          <button className="px-5 py-2 min-w-max bg-gray-900 text-white text-[15px] font-bold rounded-full hover:bg-gray-800 transition-colors">
            Tous les messages
          </button>
          <button className="px-5 py-2 min-w-max bg-white text-gray-700 border border-gray-200 text-[15px] font-semibold rounded-full hover:bg-gray-50 transition-colors">
            Non lus (1)
          </button>
          <button className="px-5 py-2 min-w-max bg-white text-gray-700 border border-gray-200 text-[15px] font-semibold rounded-full hover:bg-gray-50 transition-colors">
            Demandes (1)
          </button>
        </div>

        {/* Liste des conversations */}
        <div className="flex flex-col">
          {mockConversations.map((conv, index) => (
            <div key={conv.id} className="relative group">
              <Link 
                href={`#`} 
                className={`flex items-start gap-4 p-3 md:p-4 -mx-3 md:mx-0 rounded-2xl transition-colors hover:bg-gray-50 ${
                  index !== mockConversations.length - 1 ? 'border-b border-gray-100/60' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-sm">
                    <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                  </div>
                  {/* Indicateur Non lu sur l'avatar */}
                  {conv.unread && (
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Contenu principal */}
                <div className="flex-1 min-w-0 pr-2 pt-0.5 md:pt-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <h2 className={`text-[16px] md:text-[17px] truncate pr-4 ${conv.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>
                      {conv.name}
                    </h2>
                    <span className={`text-[12px] md:text-[13px] shrink-0 font-medium ${conv.unread ? 'text-[#8A2BE2]' : 'text-gray-400'}`}>
                      {conv.time}
                    </span>
                  </div>
                  
                  {/* Status optionnel (si c'est une demande ou confirmé) */}
                  {conv.status && (
                    <p className="text-[12px] font-bold text-gray-900 mb-0.5 uppercase tracking-wide">
                      {conv.status}
                    </p>
                  )}
                  
                  {/* Message snippet */}
                  <p className={`text-[14px] md:text-[15px] line-clamp-2 md:line-clamp-1 leading-snug ${
                    conv.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-500'
                  }`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </Link>
            </div>
          ))}
          
          {/* Message de chargement / Scroll pour plus */}
          {mockConversations.length >= 4 && (
            <div className="w-full text-center mt-8 pb-4">
              <p className="text-[14px] font-medium text-gray-400">Aucun autre message</p>
            </div>
          )}
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
