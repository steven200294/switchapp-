"use client";

import { useState } from "react";
import ConnectionModal from "./ConnectionModal";
import { useAuthStore } from "@/shared/stores/auth.store";
import DesktopNav from "./header/DesktopNav";
import DesktopSearchBar from "./header/DesktopSearchBar";
import MobileHeader from "./header/MobileHeader";

export default function Header() {
  const [activeTab, setActiveTab] = useState<"logements" | "utilisateurs">("logements");
  const { isLoggedIn, user, logout } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <DesktopNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoggedIn={isLoggedIn}
          user={user}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          setShowAuth={setShowAuth}
          logout={logout}
        />
        <DesktopSearchBar />
        <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      </header>

      {showAuth && <ConnectionModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
