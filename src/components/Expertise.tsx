import { motion } from "motion/react";
import { BarChart3, ChevronRight, Mic, School } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "../i18n/routes";

export default function Expertise() {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();

  return (
    <section id="expertise" className="py-16 sm:py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 sm:mb-14 md:mb-20"
        >
          <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">{t("expertise.eyebrow")}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black">{t("expertise.title")}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className="bg-gray-50 p-6 sm:p-8 lg:p-10 flex flex-col justify-between group hover:border-[#D32F2F]/30 border border-gray-200 transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-8 sm:mb-12">
                <div className="p-3 bg-white rounded-lg text-[#D32F2F] shadow-sm border border-gray-100">
                  <BarChart3 size={32} />
                </div>
                <span className="text-black/10 font-black text-2xl font-mono">01</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase mb-4 text-black">{t("expertise.card1.title")}</h3>
              <p className="text-gray-600 text-base sm:text-lg">
                {t("expertise.card1.description")}
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className="bg-gray-50 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border border-gray-200 hover:border-[#D32F2F]/30 transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-8 sm:mb-12">
                <div className="p-3 bg-white rounded-lg text-[#D32F2F] shadow-sm border border-gray-100">
                  <Mic size={32} />
                </div>
                <span className="text-black/10 font-black text-2xl font-mono">02</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase mb-4 text-black">{t("expertise.card2.title")}</h3>
              <p className="text-gray-600 text-base sm:text-lg">
                {t("expertise.card2.description")}
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className="bg-gray-50 p-6 sm:p-8 lg:p-10 flex flex-col justify-between group border border-gray-200 hover:border-[#D32F2F]/30 transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-8 sm:mb-12">
                <div className="p-3 bg-white rounded-lg text-[#D32F2F] shadow-sm border border-gray-100">
                  <School size={32} />
                </div>
                <span className="text-black/10 font-black text-2xl font-mono">03</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase mb-4 text-black">{t("expertise.card3.title")}</h3>
              <p className="text-gray-600 text-base sm:text-lg">
                {t("expertise.card3.description")}
              </p>
            </div>
            <Link
              to={localizedPath("catalogue")}
              className="mt-8 inline-flex items-center gap-2 self-start text-[#D32F2F] font-bold uppercase tracking-widest text-xs hover:text-[#b02626] transition-colors"
            >
              {t("expertise.viewCatalogue")}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
