import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routes, findRouteKeyByPathname, useCurrentLang } from "../i18n/routes";

function FlagFR() {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="1" height="2" x="0" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#FFFFFF" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="60" height="30" fill="#00247D" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#CF142B" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#CF142B" strokeWidth="6" />
    </svg>
  );
}

const SIZE_CLASSES = {
  small: "w-6 h-6",
  normal: "w-8 h-8",
};

interface LanguageSwitcherProps {
  size?: "small" | "normal";
  className?: string;
}

export default function LanguageSwitcher({ size = "normal", className = "" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = useCurrentLang();
  const routeKey = findRouteKeyByPathname(location.pathname) ?? "home";
  const frPath = routes[routeKey].fr;
  const enPath = routes[routeKey].en;
  const sizeClass = SIZE_CLASSES[size];

  const baseClass = `rounded-full overflow-hidden shrink-0 transition-all duration-200 ${sizeClass}`;
  const activeClass = "ring-2 ring-[#D32F2F] ring-offset-2 ring-offset-transparent opacity-100";
  const inactiveClass = "opacity-40 hover:opacity-100 ring-2 ring-transparent";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link
        to={frPath}
        onClick={() => i18n.changeLanguage("fr")}
        aria-label="Français"
        aria-current={currentLang === "fr" ? "true" : undefined}
        className={`${baseClass} ${currentLang === "fr" ? activeClass : inactiveClass}`}
      >
        <FlagFR />
      </Link>
      <Link
        to={enPath}
        onClick={() => i18n.changeLanguage("en")}
        aria-label="English"
        aria-current={currentLang === "en" ? "true" : undefined}
        className={`${baseClass} ${currentLang === "en" ? activeClass : inactiveClass}`}
      >
        <FlagGB />
      </Link>
    </div>
  );
}
