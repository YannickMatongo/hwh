/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";
import { fetchPublishedNewsItems, NewsItem } from "../lib/newsItems";
import { newsDetailPath, useCurrentLang } from "../i18n/routes";

export default function News() {
  const { t } = useTranslation();
  const lang = useCurrentLang();

  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchPublishedNewsItems()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title={t("news.seo.title")}
        description={t("news.seo.description")}
        routeKey="news"
      />
      <Header />

      <main>
        <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-10 sm:mb-14"
            >
              <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">{t("news.eyebrow")}</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black">
                {t("news.title")}
              </h1>
            </motion.div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 text-[#D32F2F] animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <p className="text-gray-500 text-lg py-12">{t("news.empty")}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {items.map((item, i) => {
                  const title = lang === "en" ? item.title_en : item.title_fr;
                  const shortDescription = lang === "en" ? item.short_description_en : item.short_description_fr;

                  return (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.08, ease: "easeOut" }}
                    >
                      <Link
                        to={newsDetailPath(lang, item.slug)}
                        className="group block h-full bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden hover:border-[#D32F2F]/30 transition-all duration-300"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                          {item.images?.[0] && (
                            <img
                              src={item.images[0]}
                              alt={title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>
                        <div className="p-6 sm:p-8">
                          <h2 className="text-xl font-black uppercase mb-3 text-black">{title}</h2>
                          <p className="text-gray-600 text-sm leading-relaxed mb-5">{shortDescription}</p>
                          <span className="inline-flex items-center gap-2 text-[#D32F2F] font-bold uppercase tracking-widest text-xs">
                            {t("news.card.readMore")}
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
