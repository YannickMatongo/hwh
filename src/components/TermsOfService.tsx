/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Placeholder({ children }: { children: ReactNode }) {
  return <span className="text-[#D32F2F] italic">[À compléter : {children}]</span>;
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title="Conditions générales | HWH Consulting"
        description="Conditions générales de HWH Consulting : présentation de l'activité, modalités de prise de rendez-vous et conditions applicables."
        path="/conditions-generales"
      />
      <Header />

      <main>
        <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">Légal</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black mb-10 sm:mb-14">
              Conditions générales
            </h1>

            <Section title="Objet">
              <p>
                Les présentes conditions générales régissent l'utilisation du site HWH Consulting ainsi que les
                relations entre HWH Consulting et toute personne sollicitant ses prestations d'audit, de formation
                ou de conférence.
              </p>
            </Section>

            <Section title="Présentation de l'activité">
              <p>
                HWH Consulting accompagne les entreprises des secteurs retail, luxe et sport sur les enjeux de
                sûreté et de performance, à travers trois types de prestations : audit &amp; conseil, conférence, et
                formation opérationnelle.
              </p>
              <p>
                <Placeholder>forme juridique, numéro SIRET et adresse du siège social</Placeholder>
              </p>
            </Section>

            <Section title="Modalités de prise de rendez-vous">
              <p>
                Les demandes de rendez-vous sont soumises via le formulaire de réservation en ligne. Chaque demande
                est examinée par l'équipe HWH Consulting et fait l'objet d'une confirmation ou d'un refus par email,
                avant toute inscription définitive au calendrier.
              </p>
            </Section>

            <Section title="Conditions d'annulation et de report">
              <p>
                <Placeholder>délai de préavis, modalités d'annulation ou de report d'un rendez-vous confirmé</Placeholder>
              </p>
            </Section>

            <Section title="Tarifs et modalités de paiement">
              <p>
                <Placeholder>grille tarifaire et modalités de paiement applicables aux prestations</Placeholder>
              </p>
            </Section>

            <Section title="Limitation de responsabilité">
              <p>
                HWH Consulting met en œuvre les moyens nécessaires à la bonne exécution de ses prestations. Sa
                responsabilité ne saurait toutefois être engagée en cas de force majeure ou de fait indépendant de
                sa volonté.
              </p>
              <p>
                <Placeholder>clause de limitation de responsabilité détaillée, à valider avec un conseil juridique</Placeholder>
              </p>
            </Section>

            <Section title="Droit applicable">
              <p>
                Les présentes conditions générales sont soumises au droit français. En cas de litige,{" "}
                <Placeholder>tribunal compétent</Placeholder>.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Pour toute question relative aux présentes conditions générales, vous pouvez contacter HWH
                Consulting à l'adresse{" "}
                <a href="mailto:consulting.hwh@gmail.com" className="text-black font-semibold hover:text-[#D32F2F] transition-colors">consulting.hwh@gmail.com</a>.
              </p>
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
