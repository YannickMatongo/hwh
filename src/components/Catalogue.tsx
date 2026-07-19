import { motion } from "motion/react";
import { BarChart3, ChevronRight, Mic, School } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "../i18n/routes";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";

const categories = [
  { icon: BarChart3, number: "01", key: "audit" },
  { icon: Mic, number: "02", key: "conference" },
  { icon: School, number: "03", key: "training" },
] as const;

export default function Catalogue() {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title={t("catalogue.seo.title")}
        description={t("catalogue.seo.description")}
        routeKey="catalogue"
      />
      <Header />

      <main>
        <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to={localizedPath("home")}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D32F2F] font-bold uppercase tracking-widest text-xs transition-colors mb-8"
              >
                <ChevronRight size={16} className="rotate-180" />
                {t("common.backHome")}
              </Link>

              <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">{t("catalogue.eyebrow")}</div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight text-black mb-10 sm:mb-14 md:mb-20 max-w-4xl">
                {t("catalogue.title")}
              </h1>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const items = t(`catalogue.categories.${category.key}.items`, { returnObjects: true }) as string[];
                return (
                  <motion.div
                    key={category.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border border-gray-200 hover:border-[#D32F2F]/30 transition-all duration-300"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-8 sm:mb-12">
                        <div className="p-3 bg-white rounded-lg text-[#D32F2F] shadow-sm border border-gray-100">
                          <Icon size={32} />
                        </div>
                        <span className="text-black/10 font-black text-2xl font-mono">{category.number}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black uppercase mb-4 text-black">
                        {t(`catalogue.categories.${category.key}.title`)}
                      </h2>
                      <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
                        {t(`catalogue.categories.${category.key}.description`)}
                      </p>

                      <ul className="space-y-3">
                        {items.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-gray-600">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#D32F2F] flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
