import { Menu } from "lucide-react";
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
          <a
            href="#services"
            onClick={(e) => handleSectionLinkClick(e, "services")}
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            Services
          </a>
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
        <nav className="md:hidden flex flex-col items-stretch gap-1 px-4 sm:px-6 pb-6 bg-black border-t border-white/10">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="py-3 text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide border-b border-white/5"
          >
            Accueil
          </Link>
          <a
            href="#expertise"
            onClick={(e) => handleSectionLinkClick(e, "expertise")}
            className="py-3 text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide border-b border-white/5"
          >
            Expertise
          </a>
          <a
            href="#services"
            onClick={(e) => handleSectionLinkClick(e, "services")}
            className="py-3 text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide border-b border-white/5"
          >
            Services
          </a>
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="mt-3 text-center bg-[#D32F2F] hover:bg-[#b02626] transition-colors px-6 py-3 rounded-md text-white text-sm font-bold"
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
