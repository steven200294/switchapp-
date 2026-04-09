"use client";

import { useState } from "react";
import ConnectionModal from "./ConnectionModal";
import { useAuthStore } from "@/shared/stores/auth.store";
import DesktopNav from "./header/DesktopNav";
import DesktopSearchBar from "./header/DesktopSearchBar";
import MobileHeader from "./header/MobileHeader";

export default function Header({ onSearchClick }: { onSearchClick?: () => void } = {}) {
  const [activeTab, setActiveTab] = useState<"logements" | "utilisateurs">("logements");
  const { isLoggedIn, user, logout } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
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
        <DesktopSearchBar onSearchClick={onSearchClick} />
        <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} onSearchClick={onSearchClick} />
      </header>

      {showAuth && <ConnectionModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
