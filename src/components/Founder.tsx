import { motion } from "motion/react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "../i18n/routes";

export default function Founder() {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();

  return (
    <section id="fondateur" className="py-16 sm:py-20 md:py-32 px-6 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <div className="space-y-6">
              <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase">{t("founder.eyebrow")}</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-black">{t("founder.name")}</h2>
              <div className="h-1 w-12 bg-[#D32F2F]"></div>

              <p className="text-gray-600 text-lg leading-relaxed">
                {t("founder.bio")}
              </p>

              <blockquote className="border-l-4 border-[#D32F2F] pl-6 italic text-gray-600 text-lg">
                {t("founder.quote")}
              </blockquote>

              <div className="pt-6">
                <Link
                  to={localizedPath("apropos")}
                  className="inline-flex items-center gap-2 group text-black font-bold uppercase tracking-widest text-xs hover:text-[#D32F2F] transition-colors"
                >
                  {t("founder.cta")}
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src="/george.jpg"
                alt={t("common.founderImageAlt")}
                loading="lazy"
                className="w-full h-full object-cover grayscale brightness-105 contrast-110"
              />
              <div className="absolute top-0 right-0 w-8 h-8 bg-[#D32F2F] flex items-center justify-center">
                <ShieldCheck size={16} className="text-white" />
              </div>
              <div className="absolute bottom-0 left-0 p-10 bg-white border border-gray-200 shadow-lg text-white font-black text-4xl hidden md:block">
                <img src="/logo.svg" alt="HWH" className="h-28 w-auto object-contain" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
