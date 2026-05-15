"use client";

import { useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { DockedActionBar } from "./DockedActionBar";

export function MobileGlobalNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="md:hidden block">
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <DockedActionBar onOpenMenu={() => setMenuOpen(true)} />
    </div>
  );
}
