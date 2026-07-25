/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";
import ImageCarousel from "./ImageCarousel";
import { fetchPublishedNewsItemBySlug, NewsItem } from "../lib/newsItems";
import { useCurrentLang, useLocalizedPath } from "../i18n/routes";

const YOUTUBE_ID_PATTERN = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

function getYouTubeId(url: string): string | null {
  const match = url.match(YOUTUBE_ID_PATTERN);
  return match ? match[1] : null;
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const lang = useCurrentLang();
  const localizedPath = useLocalizedPath();

  const [item, setItem] = useState<NewsItem | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setItem(undefined);

    fetchPublishedNewsItemBySlug(slug)
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch(() => {
        if (!cancelled) setItem(null);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (item === undefined) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#D32F2F] animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-white text-black font-sans">
        <SEO title={t("news.detail.notFoundTitle")} description={t("news.detail.notFoundBody")} routeKey="news" />
        <Header />
        <main className="pt-32 pb-32 px-6 text-center">
          <h1 className="text-3xl font-black uppercase mb-4 text-black">{t("news.detail.notFoundTitle")}</h1>
          <p className="text-gray-600 mb-8">{t("news.detail.notFoundBody")}</p>
          <Link
            to={localizedPath("news")}
            className="inline-flex items-center gap-2 text-[#D32F2F] font-bold uppercase tracking-widest text-xs hover:text-[#b02626] transition-colors"
          >
            <ChevronLeft size={16} /> {t("news.detail.back")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const title = lang === "en" ? item.title_en : item.title_fr;
  const shortDescription = lang === "en" ? item.short_description_en : item.short_description_fr;
  const fullDescription = lang === "en" ? item.full_description_en : item.full_description_fr;
  const youTubeId = item.video_url ? getYouTubeId(item.video_url) : null;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title={`${title} | HWH Consulting`}
        description={shortDescription}
        routeKey="news"
        slugPaths={{ fr: `/actualites/${item.slug}`, en: `/en/news/${item.slug}` }}
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
              <Link
                to={localizedPath("news")}
                className="inline-flex items-center gap-2 text-black font-bold uppercase tracking-widest text-xs hover:text-[#D32F2F] transition-colors mb-8"
              >
                <ChevronLeft size={16} /> {t("news.detail.back")}
              </Link>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black mb-10">
                {title}
              </h1>

              {item.images.length > 0 && (
                <div className="mb-10 sm:mb-14">
                  <ImageCarousel
                    images={item.images.map((src, i) => ({ src, alt: `${title} — ${i + 1}` }))}
                    prevLabel={t("news.carouselPrev")}
                    nextLabel={t("news.carouselNext")}
                    goToLabel={t("news.carouselGoTo")}
                  />
                </div>
              )}

              {youTubeId && (
                <div className="relative w-full aspect-video mb-10 sm:mb-14 overflow-hidden rounded-2xl border border-gray-200 bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${youTubeId}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              )}

              <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">{fullDescription}</div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
