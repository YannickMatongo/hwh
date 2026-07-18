import { Instagram, Linkedin, Menu, X } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const HEADER_OFFSET = 80;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
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
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black border-b border-[#D32F2F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tighter flex items-center text-white cursor-pointer">
          HWH<span className="w-2 h-2 bg-[#D32F2F] rounded-full ml-1"></span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            Accueil
          </Link>
          <a
            href="#expertise"
            onClick={(e) => handleSectionLinkClick(e, "expertise")}
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            Expertise
          </a>
          <Link
            to="/catalogue"
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            Services
          </Link>
          <Link
            to="/reservation"
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            Réserver un rendez-vous
          </Link>
          <Link
            to="/contact"
            className="bg-[#D32F2F] hover:bg-[#b02626] transition-colors px-6 py-3 rounded-md text-white text-sm font-bold"
          >
            Contact
          </Link>
        </nav>

        <button
          className="md:hidden text-white p-2.5 -mr-2.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
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
              aria-label="Fermer le menu"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
            <img src="/logo.png" alt="Logo HWH Consulting" loading="lazy" className="h-8" />
            <div className="w-8" aria-hidden="true" />
          </div>

          <div className="flex-1 overflow-y-auto pb-10">
            {/* Main Navigation */}
            <nav className="flex flex-col items-center gap-8 mt-12">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-black hover:text-[#D32F2F] transition-colors"
              >
                Accueil
              </Link>
              <a
                href="#expertise"
                onClick={(e) => handleSectionLinkClick(e, "expertise")}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-black hover:text-[#D32F2F] transition-colors"
              >
                Expertise
              </a>
              <Link
                to="/catalogue"
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-black hover:text-[#D32F2F] transition-colors"
              >
                Catalogue
              </Link>
              <Link
                to="/reservation"
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-black hover:text-[#D32F2F] transition-colors"
              >
                Réservation
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-black hover:text-[#D32F2F] transition-colors"
              >
                Contact
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
