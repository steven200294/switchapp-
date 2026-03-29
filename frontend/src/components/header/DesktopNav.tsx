import Link from "next/link";
import { Globe, Menu, User } from "lucide-react";
import type { AuthUser } from "@/shared/auth/types/auth.types";

type Props = {
  activeTab: "logements" | "utilisateurs";
  setActiveTab: (t: "logements" | "utilisateurs") => void;
  isLoggedIn: boolean;
  user: AuthUser | null;
  showMenu: boolean;
  setShowMenu: (v: boolean) => void;
  setShowAuth: (v: boolean) => void;
  logout: () => void;
};

const menuLinks = [
  { href: "/profil", label: "Mon profil" },
  { href: "/messages", label: "Messages" },
  { href: "/favoris", label: "Favoris" },
] as const;

export default function DesktopNav({ activeTab, setActiveTab, isLoggedIn, user, showMenu, setShowMenu, setShowAuth, logout }: Props) {
  const tabCls = (on: boolean) =>
    `text-body-lg transition-colors pb-1 border-b-2 flex flex-col items-center gap-1 ${on ? "font-semibold text-gray-900 border-black" : "font-medium text-gray-500 hover:text-gray-900 border-transparent hover:border-gray-300"}`;

  return (
    <div className="max-w-[1440px] mx-auto px-6 h-20 hidden md:flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <Link href="/explorer" className="text-title-lg font-black bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent cursor-pointer tracking-tight">
          SwitchAppart
        </Link>
      </div>
      <div className="flex-1 flex justify-center gap-8">
        {(["logements", "utilisateurs"] as const).map((id) => (
          <button key={id} type="button" onClick={() => setActiveTab(id)} className={tabCls(activeTab === id)}>
            {id === "logements" ? "Logements" : "Utilisateurs"}
          </button>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-end gap-2 text-gray-700">
        <Link href="/explorer" className="hidden lg:block text-body font-semibold hover:bg-gray-100 px-4 py-3 rounded-full transition-colors truncate">
          Proposer son logement
        </Link>
        <button type="button" className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-colors" aria-label="Langue">
          <Globe className="w-4 h-4" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              if (isLoggedIn) setShowMenu(!showMenu);
              else setShowAuth(true);
            }}
            className="flex items-center gap-3 border border-gray-300 rounded-full py-1 pl-3 pr-1 hover:shadow-md transition-all ml-1 bg-white"
          >
            <Menu className="w-4 h-4" />
            <div className="w-8 h-8 rounded-full bg-gray-500 overflow-hidden text-gray-300 flex items-center justify-center">
              {isLoggedIn && user?.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
            </div>
          </button>
          {showMenu && isLoggedIn && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-body font-bold text-gray-900">{user?.full_name || "Mon profil"}</p>
                <p className="text-caption text-gray-400">{user?.email}</p>
              </div>
              {menuLinks.map((item) => (
                <Link key={item.href} href={item.href} className="block px-4 py-3 text-body text-gray-700 font-medium hover:bg-gray-50 transition-colors" onClick={() => setShowMenu(false)}>
                  {item.label}
                </Link>
              ))}
              <button type="button" onClick={() => { logout(); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-body text-red-500 font-medium hover:bg-red-50 transition-colors border-t border-gray-100">
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
