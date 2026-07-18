/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";

export default function APropos() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title="À Propos | HWH Consulting"
        description="Georges D., fondateur de HWH Consulting : 20 ans d'expérience terrain en sûreté et performance retail, luxe et sport. Audit, formation et conférence."
        path="/a-propos"
      />
      <Header />

      <main>
        <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center mb-16 sm:mb-20 md:mb-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 order-2 lg:order-1"
              >
                <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">Le Fondateur</div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter mb-6 sm:mb-8 text-black">
                  Georges D.
                </h1>
                <p className="text-gray-600 text-lg sm:text-xl font-medium leading-relaxed max-w-xl">
                  20 ans d'expérience terrain entre retail et sûreté, du sport au luxe : une expertise au service de
                  la protection et de la performance de votre activité.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-7 order-1 lg:order-2"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden grayscale brightness-105 contrast-110">
                  <img
                    src="/george.jpg"
                    alt="Georges D., fondateur et consultant en sûreté chez HWH Consulting"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[#D32F2F] flex items-center justify-center">
                    <ShieldCheck size={16} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 p-8 bg-[#D32F2F]/90 text-white font-black text-4xl hidden md:block">
                    HWH
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl flex flex-col gap-6"
            >
              <p className="text-gray-600 text-lg leading-relaxed">
                Georges D. a construit son expertise sur le terrain, au cœur des enjeux de sûreté et de performance
                qui traversent les univers du retail, du sport et du luxe. Vingt années d'expérience opérationnelle
                lui ont permis de comprendre, de l'intérieur, ce qui distingue une stratégie de sécurité théorique
                d'une protection réellement efficace.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Issu d'un parcours d'officier supérieur, il a développé une lecture approfondie des risques :
                gestion de crise, protection rapprochée, sécurisation d'informations sensibles et coordination
                d'équipes opérationnelles sous contrainte. Cette expérience du commandement et de la décision en
                situation exigeante constitue aujourd'hui le socle de son approche du conseil.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Consultant formateur, Georges accompagne aujourd'hui les entreprises dans l'évaluation de leurs
                vulnérabilités et l'élaboration de protocoles de sécurité sur-mesure. Il conçoit et anime des
                formations opérationnelles pour des équipes de terrain, et intervient régulièrement lors de
                conférences pour sensibiliser comités de direction et collaborateurs aux enjeux sécuritaires
                contemporains, de l'intelligence économique aux cybermenaces.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Sa conviction reste la même depuis toujours : la sécurité ne s'improvise pas, elle se construit.
                Anticiper les risques, transmettre les bons réflexes et protéger durablement les activités de ses
                clients — c'est la mission qu'il poursuit à travers HWH Consulting.
              </p>

              <blockquote className="border-l-4 border-[#D32F2F] pl-6 italic text-gray-600 text-lg mt-4">
                "La sécurité n'est pas une option, c'est le socle de toute stratégie pérenne. Notre mission est
                d'anticiper, de former et de protéger."
              </blockquote>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mt-16 sm:mt-20 md:mt-28 border-t border-gray-200 pt-12 sm:pt-16 flex flex-col items-start gap-6"
            >
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-black">
                Envie d'échanger ?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto">
                <Link
                  to="/contact"
                  className="bg-[#D32F2F] hover:bg-[#b02626] transition-all hover:translate-x-1 duration-300 text-white font-bold px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-center gap-3"
                >
                  Prendre contact <ChevronRight size={20} />
                </Link>
                <Link
                  to="/reservation"
                  className="border border-gray-300 hover:border-gray-900 transition-colors text-gray-900 font-bold px-6 sm:px-8 py-4 sm:py-5 text-center"
                >
                  Réserver un échange
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
