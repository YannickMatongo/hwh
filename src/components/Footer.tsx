import { Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "../i18n/routes";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();

  return (
    <footer className="bg-black border-t-[12px] border-[#D32F2F] pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16 px-0 sm:px-6">
          <div className="flex items-center">
            <img src="/logo.svg" alt={t("common.logoAlt")} className="h-16 sm:h-20 w-auto object-contain" />
          </div>

          <div className="flex flex-col items-center gap-5 sm:gap-6">
            <div className="flex items-center gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 text-gray-500 hover:text-[#D32F2F] transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 text-gray-500 hover:text-[#D32F2F] transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <LanguageSwitcher size="small" />
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-12">
              <Link to={localizedPath("reservation")} className="text-gray-500 hover:text-[#D32F2F] text-[10px] uppercase font-black tracking-widest transition-colors">{t("footer.booking")}</Link>
              <Link to={localizedPath("contact")} className="text-gray-500 hover:text-[#D32F2F] text-[10px] uppercase font-black tracking-widest transition-colors">{t("footer.contact")}</Link>
              <Link to={localizedPath("privacy")} className="text-gray-500 hover:text-[#D32F2F] text-[10px] uppercase font-black tracking-widest transition-colors">{t("footer.privacy")}</Link>
              <Link to={localizedPath("terms")} className="text-gray-500 hover:text-[#D32F2F] text-[10px] uppercase font-black tracking-widest transition-colors">{t("footer.terms")}</Link>
              <Link to={localizedPath("footprint")} className="text-gray-500 hover:text-[#D32F2F] text-[10px] uppercase font-black tracking-widest transition-colors">{t("footer.footprint")}</Link>
              <Link to={localizedPath("careers")} className="text-gray-500 hover:text-[#D32F2F] text-[10px] uppercase font-black tracking-widest transition-colors">{t("footer.careers")}</Link>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-700 text-[9px] sm:text-[10px] uppercase font-black tracking-[0.2em] sm:tracking-[0.3em] border-t border-white/5 pt-8">
          {t("footer.copyright")}{" "}
          <a
            href="https://www.linkedin.com/in/yannick-matongo-developpeur-web/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#D32F2F] transition-colors"
          >
            {t("footer.devName")}
          </a>
        </div>
      </div>
    </footer>
  );
}
