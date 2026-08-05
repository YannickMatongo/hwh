/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Check, X, AlertTriangle, HelpCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";

type Status = "accepted" | "refused" | "already" | "notfound" | "invalid" | "error";

interface StatusContent {
  icon: typeof Check;
  title: string;
  message: (params: URLSearchParams) => string;
}

const STATUS_CONTENT: Record<Status, StatusContent> = {
  accepted: {
    icon: Check,
    title: "Rendez-vous confirmé",
    message: (params) =>
      `Le rendez-vous avec ${params.get("name") || "le client"} a été accepté et ajouté au calendrier. Un email de confirmation lui a été envoyé.`,
  },
  refused: {
    icon: X,
    title: "Demande refusée",
    message: (params) => `La demande de ${params.get("name") || "le client"} a été refusée. Un email l'informant a été envoyé.`,
  },
  already: {
    icon: HelpCircle,
    title: "Déjà traité",
    message: (params) => `Cette demande a déjà été traitée (statut actuel : ${params.get("outcome") || "inconnu"}).`,
  },
  notfound: {
    icon: AlertTriangle,
    title: "Demande introuvable",
    message: () => "Cette demande de rendez-vous n'existe pas ou a été supprimée.",
  },
  invalid: {
    icon: AlertTriangle,
    title: "Requête invalide",
    message: () => "Le lien utilisé est invalide ou incomplet.",
  },
  error: {
    icon: AlertTriangle,
    title: "Erreur",
    message: () => "Une erreur est survenue lors du traitement de la demande.",
  },
};

export default function BookingStatus() {
  const [searchParams] = useSearchParams();
  const status = (searchParams.get("status") as Status) || "error";
  const content = STATUS_CONTENT[status] ?? STATUS_CONTENT.error;
  const Icon = content.icon;
  const isPositive = status === "accepted";

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white flex flex-col">
      <SEO title={`${content.title} - HWH Consulting`} description={content.title} noIndex />
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-gray-200 p-8 md:p-10 flex flex-col items-center text-center gap-6"
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${
              isPositive ? "bg-black" : "bg-[#D32F2F]"
            }`}
          >
            <Icon className="w-8 h-8 stroke-[3]" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black tracking-tight uppercase">{content.title}</h1>
            <p className="text-gray-600 text-sm leading-relaxed">{content.message(searchParams)}</p>
          </div>

          <Link
            to="/"
            className="bg-[#D32F2F] hover:bg-[#b02626] transition-all hover:translate-x-1 duration-300 text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider"
          >
            Retour à l'accueil
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
