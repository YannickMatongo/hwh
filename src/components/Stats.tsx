import { motion } from "motion/react";

const stats = [
  { value: "10", suffix: "+", label: "ans d'expérience" },
  { value: "140", suffix: "", label: "audits" },
  { value: "120", suffix: "", label: "investigations" },
  { value: "2", suffix: "", label: "langues d'intervention" },
];

export default function Stats() {
  return (
    <section className="py-14 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-gray-200">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
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
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
