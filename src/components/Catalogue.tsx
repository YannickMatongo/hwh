import { motion } from "motion/react";
import { BarChart3, ChevronRight, Mic, School } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const categories = [
  {
    icon: BarChart3,
    number: "01",
    title: "Audit & Conseil",
    description:
      "Évaluation exhaustive des vulnérabilités, analyse des risques et élaboration de protocoles de sécurité sur-mesure pour les infrastructures critiques.",
    items: [
      "Audit de vulnérabilités physiques et numériques",
      "Analyse de risques stratégiques",
      "Élaboration de protocoles de sécurité sur-mesure",
      "Accompagnement à la mise en conformité",
    ],
  },
  {
    icon: Mic,
    number: "02",
    title: "Conférence",
    description:
      "Sensibilisation des comités de direction aux enjeux sécuritaires contemporains et à l'intelligence économique.",
    items: [
      "Sensibilisation des comités de direction",
      "Interventions sur l'intelligence économique",
      "Ateliers de sensibilisation aux cybermenaces",
      "Conférences grand public et corporate",
    ],
  },
  {
    icon: School,
    number: "03",
    title: "Formation Opérationnelle",
    description:
      "Programmes intensifs d'entraînement à la gestion de crise, protection rapprochée et sécurisation d'informations sensibles pour équipes de terrain.",
    items: [
      "Gestion de crise et cellule de crise",
      "Protection rapprochée",
      "Sécurisation d'informations sensibles",
      "Entraînement terrain pour équipes opérationnelles",
    ],
  },
];

export default function Catalogue() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
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
                to="/"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D32F2F] font-bold uppercase tracking-widest text-xs transition-colors mb-8"
              >
                <ChevronRight size={16} className="rotate-180" />
                Retour à l'accueil
              </Link>

              <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">Catalogue</div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight text-black mb-10 sm:mb-14 md:mb-20 max-w-4xl">
                Catalogue des Prestations
              </h1>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.title}
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
                      <h3 className="text-2xl sm:text-3xl font-black uppercase mb-4 text-black">{category.title}</h3>
                      <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">{category.description}</p>

                      <ul className="space-y-3">
                        {category.items.map((item) => (
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
