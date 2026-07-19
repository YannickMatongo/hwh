/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";

export default function GlobalFootprint() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title={t("legal.footprint.seo.title")}
        description={t("legal.footprint.seo.description")}
        routeKey="footprint"
      />
      <Header />

      <main>
        <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">{t("legal.footprint.eyebrow")}</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black mb-10 sm:mb-14">
                {t("legal.footprint.title")}
              </h1>

              <div className="text-gray-600 leading-relaxed flex flex-col gap-4">
                <p>{t("legal.footprint.body")}</p>
                <p className="text-[#D32F2F] italic">
                  {t("legal.footprint.placeholder")}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
