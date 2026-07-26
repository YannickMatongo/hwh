/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface AdminSection {
  label: string;
  to: string;
}

// Add future back-office sections here — active-state matching below scales automatically.
const ADMIN_SECTIONS: AdminSection[] = [{ label: "Actualités", to: "/admin" }];

// Mirrors Header.tsx's public nav — these lead to the real public pages, not the back-office.
const PUBLIC_NAV_LINKS = [
  { label: "Accueil", to: "/" },
  { label: "Expertise", to: "/#expertise" },
  { label: "Réserver un rendez-vous", to: "/reservation" },
  { label: "Actualités", to: "/actualites" },
  { label: "Contact", to: "/contact" },
];

export default function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const isAdminSectionActive = (to: string) => location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
        <Link to="/admin" className="flex items-center gap-2.5 flex-shrink-0">
          <img src="/logo.svg" alt="HWH Consulting" className="h-8 w-auto" />
          <span className="text-sm font-bold text-black uppercase tracking-wide">Administration</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5 pl-5 border-l border-gray-200 flex-shrink-0">
          {ADMIN_SECTIONS.map((section) => (
            <Link
              key={section.to}
              to={section.to}
              className={`text-sm font-semibold pb-1 border-b-2 transition-colors whitespace-nowrap ${
                isAdminSectionActive(section.to)
                  ? "text-[#D32F2F] border-[#D32F2F]"
                  : "text-gray-600 border-transparent hover:text-black"
              }`}
            >
              {section.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#D32F2F] transition-colors"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>

        <div className="flex lg:hidden items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
            className="p-1.5 text-gray-600 hover:text-black transition-colors"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Se déconnecter"
            className="p-1.5 text-gray-600 hover:text-[#D32F2F] transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col gap-1">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 pt-3 border-t border-gray-200 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Back-office</span>
            {ADMIN_SECTIONS.map((section) => (
              <Link
                key={section.to}
                to={section.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-semibold py-2 transition-colors ${
                  isAdminSectionActive(section.to) ? "text-[#D32F2F]" : "text-gray-700 hover:text-black"
                }`}
              >
                {section.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
