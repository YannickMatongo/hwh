import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const stats = [
  { value: "10", suffix: "+", labelKey: "stats.experience" },
  { value: "140", suffix: "", labelKey: "stats.audits" },
  { value: "120", suffix: "", labelKey: "stats.investigations" },
  { value: "2", suffix: "", labelKey: "stats.languages" },
];

export default function Stats() {
  const { t } = useTranslation();

  return (
    <section className="py-14 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-gray-200">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center px-3 sm:px-6 py-5 sm:py-8"
            >
              <div className="text-3xl sm:text-5xl md:text-6xl font-black text-black tracking-tighter">
                {stat.value}
                <span className="text-[#D32F2F]">{stat.suffix}</span>
              </div>
              <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                {t(stat.labelKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
