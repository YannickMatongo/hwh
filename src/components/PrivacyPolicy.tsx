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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title="Politique de confidentialité | HWH Consulting"
        description="Politique de confidentialité de HWH Consulting : données collectées, finalités, durée de conservation et droits des utilisateurs."
        path="/politique-de-confidentialite"
      />
      <Header />

      <main>
        <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">Légal</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black mb-10 sm:mb-14">
              Politique de confidentialité
            </h1>

            <Section title="Responsable du traitement">
              <p>
                Le responsable du traitement des données collectées sur ce site est HWH Consulting, joignable à
                l'adresse <a href="mailto:consulting.hwh@gmail.com" className="text-black font-semibold hover:text-[#D32F2F] transition-colors">consulting.hwh@gmail.com</a>.
              </p>
              <p>
                <Placeholder>forme juridique, numéro SIRET et adresse du siège social</Placeholder>
              </p>
            </Section>

            <Section title="Données collectées">
              <p>
                Dans le cadre de l'utilisation des formulaires de contact et de réservation présents sur ce site,
                les données suivantes sont collectées : nom, adresse email, numéro de téléphone, message ainsi que,
                pour les demandes de rendez-vous, le créneau souhaité.
              </p>
            </Section>

            <Section title="Finalité du traitement">
              <p>
                Ces données sont utilisées exclusivement pour répondre aux demandes de contact et pour traiter les
                demandes de rendez-vous (audit, formation ou conférence) soumises via le site.
              </p>
            </Section>

            <Section title="Destinataires des données">
              <p>
                Les données sont destinées à HWH Consulting. Elles peuvent transiter par des prestataires
                techniques utilisés pour le fonctionnement du site (hébergement de base de données, envoi d'emails
                transactionnels, gestion de calendrier).
              </p>
              <p>
                <Placeholder>liste exhaustive des sous-traitants et de leur rôle, le cas échéant</Placeholder>
              </p>
            </Section>

            <Section title="Durée de conservation">
              <p>
                <Placeholder>durée de conservation des données collectées via les formulaires</Placeholder>
              </p>
            </Section>

            <Section title="Cookies et traceurs">
              <p>
                <Placeholder>précisez si des cookies, outils de mesure d'audience ou traceurs sont utilisés sur le site</Placeholder>
              </p>
            </Section>

            <Section title="Vos droits">
              <p>
                Conformément à la réglementation applicable en matière de protection des données personnelles, vous
                disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos
                données. Vous pouvez exercer ces droits à tout moment en écrivant à{" "}
                <a href="mailto:consulting.hwh@gmail.com" className="text-black font-semibold hover:text-[#D32F2F] transition-colors">consulting.hwh@gmail.com</a>.
              </p>
            </Section>

            <Section title="Mise à jour">
              <p>
                <Placeholder>date de dernière mise à jour de cette politique de confidentialité</Placeholder>
              </p>
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
