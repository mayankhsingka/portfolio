"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MobileMenu } from "./MobileMenu";
import { DockedActionBar } from "./DockedActionBar";
import { DesktopTeaserModal } from "./DesktopTeaserModal";

export function MobileGlobalNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [teaserOpen, setTeaserOpen] = useState(false);

  // Listen globally so PC Mode works from any route — not just the home PDA.
  useEffect(() => {
    const handleTeaser = () => setTeaserOpen(true);
    window.addEventListener("system-open-teaser", handleTeaser);
    return () => window.removeEventListener("system-open-teaser", handleTeaser);
  }, []);

  return (
    <div className="md:hidden block">
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <DockedActionBar onOpenMenu={() => setMenuOpen(true)} />
      <AnimatePresence>
        {teaserOpen && <DesktopTeaserModal onClose={() => setTeaserOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
