import type { MockMatch, MockConversation } from "../types/messages.types";

export const MOCK_MATCHES: MockMatch[] = [
  { id: 1, name: "Thomas", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=150&q=80", city: "Paris" },
  { id: 2, name: "Émilie", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&q=80", city: "Lyon" },
  { id: 3, name: "Lucas", avatar: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?fit=crop&w=150&q=80", city: "Marseille" },
  { id: 4, name: "Marie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&q=80", city: "Bordeaux" },
  { id: 5, name: "Antoine", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&q=80", city: "Nice" },
];

export const MOCK_CONVERSATIONS: MockConversation[] = [
  { id: 1, name: "Thomas Dubois", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=150&q=80", lastMessage: "Salut ! Ton appartement à Paris a l'air super, on pourrait échanger sur les dates ?", time: "14:32", unread: true, status: "Demande reçue" },
  { id: 2, name: "Émilie Laurent", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&q=80", lastMessage: "C'est confirmé pour le 15 août. J'ai hâte, merci encore ! On se capte à l'arrivée.", time: "Hier", unread: false, status: "Échange confirmé" },
  { id: 3, name: "Lucas & Chloé", avatar: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?fit=crop&w=150&q=80", lastMessage: "Bonjour, est-ce que le quartier est calme le soir ? Nous cherchons un endroit reposant.", time: "Lun.", unread: false, status: "" },
  { id: 4, name: "Marie Silva", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&q=80", lastMessage: "Merci pour les infos. Je regarde ça et je vous tiens au courant très rapidement.", time: "12 Mar", unread: false, status: "" },
];
