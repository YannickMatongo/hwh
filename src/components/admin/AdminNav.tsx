/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface AdminNavLink {
  label: string;
  to: string;
}

// Add future back-office sections here — active-state matching below scales automatically.
const ADMIN_NAV_LINKS: AdminNavLink[] = [{ label: "Actualités", to: "/admin" }];

export default function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/admin" className="flex items-center gap-2.5 flex-shrink-0">
          <img src="/logo.svg" alt="HWH Consulting" className="h-8 w-auto" />
          <span className="text-sm font-bold text-black uppercase tracking-wide">Administration</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          {ADMIN_NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
                  isActive ? "text-[#D32F2F] border-[#D32F2F]" : "text-gray-600 border-transparent hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#D32F2F] transition-colors flex-shrink-0"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Se déconnecter</span>
        </button>
      </div>
    </header>
  );
}
