/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";
import ImageCarousel from "./ImageCarousel";

const PLACEHOLDER_IMAGE_COUNT = 4;

export default function News() {
  const { t } = useTranslation();

  const placeholderImages = Array.from({ length: PLACEHOLDER_IMAGE_COUNT }, () => ({
    src: "/georges3.jpg",
    alt: t("news.carouselImageAlt"),
  }));

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
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">{t("news.eyebrow")}</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black mb-10 sm:mb-14">
                {t("news.title")}
              </h1>

              <div className="text-gray-600 leading-relaxed flex flex-col gap-4">
                <p className="text-[#D32F2F] italic">
                  {t("news.placeholder")}
                </p>
              </div>

              <div className="mt-10 sm:mt-14">
                <ImageCarousel
                  images={placeholderImages}
                  caption={t("news.carouselCaption")}
                  prevLabel={t("news.carouselPrev")}
                  nextLabel={t("news.carouselNext")}
                  goToLabel={t("news.carouselGoTo")}
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
