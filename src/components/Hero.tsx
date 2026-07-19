import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#D32F2F]/40 bg-[#D32F2F]/5 text-[#D32F2F] text-xs font-black tracking-widest uppercase mb-6 sm:mb-8">
            {t("hero.badge")}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter mb-6 sm:mb-8 max-w-4xl text-black">
            {t("hero.titlePrefix")}
            <span className="text-[#D32F2F] underline decoration-[#D32F2F] underline-offset-8">
              {t("hero.titleHighlight")}
            </span>
            {t("hero.titleSuffix")}
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl font-medium max-w-2xl mb-8 sm:mb-12 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto">
            <button className="bg-[#D32F2F] hover:bg-[#b02626] transition-all hover:translate-x-1 duration-300 text-white font-bold px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-center gap-3">
              {t("hero.ctaPrimary")} <ArrowRight size={20} />
            </button>
            <button className="border border-gray-300 hover:border-gray-900 transition-colors text-gray-900 font-bold px-6 sm:px-8 py-4 sm:py-5">
              {t("hero.ctaSecondary")}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Faded Background Text */}
      <div className="absolute bottom-10 sm:bottom-20 right-[-5%] text-[28vw] sm:text-[25vw] font-black text-black/5 pointer-events-none select-none overflow-hidden leading-none uppercase">
        HWH
      </div>
    </section>
  );
}
