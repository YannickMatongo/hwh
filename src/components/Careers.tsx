/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Mail } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";

export default function Careers() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title="Carrières | HWH Consulting"
        description="Opportunités professionnelles chez HWH Consulting et candidatures spontanées."
        path="/carrieres"
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
              <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">Rejoindre HWH</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black mb-10 sm:mb-14">
                Carrières
              </h1>

              <div className="text-gray-600 leading-relaxed flex flex-col gap-4 mb-10">
                <p className="text-[#D32F2F] italic">
                  [À compléter : postes disponibles, ou message du type "Aucune offre actuelle, envoyez une
                  candidature spontanée à consulting.hwh@gmail.com"]
                </p>
              </div>

              <a
                href="mailto:consulting.hwh@gmail.com"
                className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 transition-colors text-white font-bold px-6 sm:px-8 py-4 sm:py-5"
              >
                <Mail size={20} />
                Envoyer une candidature spontanée
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
