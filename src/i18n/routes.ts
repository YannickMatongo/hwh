import { useTranslation } from "react-i18next";

export type Lang = "fr" | "en";

export type RouteKey =
  | "home"
  | "catalogue"
  | "contact"
  | "reservation"
  | "apropos"
  | "privacy"
  | "terms"
  | "footprint"
  | "careers";

export const routes: Record<RouteKey, Record<Lang, string>> = {
  home: { fr: "/", en: "/en" },
  catalogue: { fr: "/catalogue", en: "/en/catalog" },
  contact: { fr: "/contact", en: "/en/contact" },
  reservation: { fr: "/reservation", en: "/en/booking" },
  apropos: { fr: "/a-propos", en: "/en/about" },
  privacy: { fr: "/politique-de-confidentialite", en: "/en/privacy-policy" },
  terms: { fr: "/conditions-generales", en: "/en/terms-of-service" },
  footprint: { fr: "/presence", en: "/en/global-footprint" },
  careers: { fr: "/carrieres", en: "/en/careers" },
};

export function findRouteKeyByPathname(pathname: string): RouteKey | null {
  const entries = Object.entries(routes) as [RouteKey, Record<Lang, string>][];
  for (const [key, paths] of entries) {
    if (paths.fr === pathname || paths.en === pathname) return key;
  }
  return null;
}

export function useCurrentLang(): Lang {
  const { i18n } = useTranslation();
  return i18n.language?.startsWith("en") ? "en" : "fr";
}

/** Returns a function that resolves a RouteKey to the path in the current language. */
export function useLocalizedPath() {
  const lang = useCurrentLang();
  return (key: RouteKey) => routes[key][lang];
}
