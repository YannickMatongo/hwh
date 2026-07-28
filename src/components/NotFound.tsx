/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocalizedPath } from "../i18n/routes";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";

export default function NotFound() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const localizedPath = useLocalizedPath();

  const lang = location.pathname.startsWith("/en") ? "en" : "fr";

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white flex flex-col">
      <SEO title={t("notFound.seo.title")} description={t("notFound.seo.description")} noIndex />
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto flex flex-col items-center"
        >
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none text-[#D32F2F] mb-4 sm:mb-6">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase leading-tight text-black mb-6">
            {t("notFound.title")}
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl font-medium max-w-xl mb-8 sm:mb-12 leading-relaxed">
            {t("notFound.description")}
          </p>
          <Link
            to={localizedPath("home")}
            className="bg-[#D32F2F] hover:bg-[#b02626] transition-all hover:translate-x-1 duration-300 text-white font-bold px-6 sm:px-8 py-4 sm:py-5 inline-flex items-center justify-center gap-3"
          >
            {t("notFound.backHome")} <ArrowRight size={20} />
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
