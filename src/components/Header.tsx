import { Instagram, Linkedin, Menu, X } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "../i18n/routes";
import LanguageSwitcher from "./LanguageSwitcher";

const HEADER_OFFSET = 80;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Header() {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const homePath = localizedPath("home");
  const isHome = location.pathname === homePath;

  useEffect(() => {
    if (isHome && location.hash) {
      const id = location.hash.replace("#", "");
      requestAnimationFrame(() => scrollToSection(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleSectionLinkClick = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isHome) {
      scrollToSection(id);
    } else {
      navigate(`${homePath}#${id}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black border-b border-[#D32F2F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
        <Link to={homePath} className="flex items-center cursor-pointer">
          <img src="/logo.svg" alt={t("common.logoAlt")} className="h-14 sm:h-16" />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          <Link
            to={homePath}
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            {t("header.nav.home")}
          </Link>
          <a
            href="#expertise"
            onClick={(e) => handleSectionLinkClick(e, "expertise")}
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            {t("header.nav.expertise")}
          </a>
          <Link
            to={localizedPath("catalogue")}
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            {t("header.nav.services")}
          </Link>
          <Link
            to={localizedPath("reservation")}
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            {t("header.nav.booking")}
          </Link>
          <LanguageSwitcher size="small" />
          <Link
            to={localizedPath("contact")}
            className="bg-[#D32F2F] hover:bg-[#b02626] transition-colors px-6 py-3 rounded-md text-white text-sm font-bold"
          >
            {t("header.nav.contact")}
          </Link>
        </nav>

        <button
          className="md:hidden text-white p-2.5 -mr-2.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={t("header.menuAriaLabel")}
          aria-expanded={isMenuOpen}
        >
          <Menu size={24} />
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 text-[#D32F2F] hover:opacity-80 transition-opacity"
              aria-label={t("header.mobile.closeMenu")}
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
            <img src="/logo.svg" alt={t("common.logoAlt")} loading="lazy" className="h-14" />
            <LanguageSwitcher size="small" />
          </div>

          <div className="flex-1 overflow-y-auto pb-10">
            {/* Main Navigation */}
            <nav className="flex flex-col items-center gap-8 mt-12">
              <Link
                to={homePath}
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-black hover:text-[#D32F2F] transition-colors"
              >
                {t("header.mobile.home")}
              </Link>
              <a
                href="#expertise"
                onClick={(e) => handleSectionLinkClick(e, "expertise")}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-black hover:text-[#D32F2F] transition-colors"
              >
                {t("header.mobile.expertise")}
              </a>
              <Link
                to={localizedPath("catalogue")}
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-black hover:text-[#D32F2F] transition-colors"
              >
                {t("header.mobile.catalogue")}
              </Link>
              <Link
                to={localizedPath("reservation")}
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-black hover:text-[#D32F2F] transition-colors"
              >
                {t("header.mobile.reservation")}
              </Link>
              <Link
                to={localizedPath("contact")}
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-black hover:text-[#D32F2F] transition-colors"
              >
                {t("header.mobile.contact")}
              </Link>
            </nav>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-6 mt-16">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-black hover:text-[#D32F2F] transition-colors"
              >
                <Instagram className="w-5 h-5 stroke-[2]" />
              </a>
              <a
                href="https://www.linkedin.com/in/georgesdavid/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-black hover:text-[#D32F2F] transition-colors"
              >
                <Linkedin className="w-5 h-5 stroke-[2]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
