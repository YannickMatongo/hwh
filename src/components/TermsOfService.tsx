/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-10 first:mt-0"
    >
      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed flex flex-col gap-3">{children}</div>
    </motion.div>
  );
}

function Placeholder({ text }: { text: string }) {
  return <span className="text-[#D32F2F] italic">{text}</span>;
}

const EMAIL_LINK = (
  <a href="mailto:consulting.hwh@gmail.com" className="text-black font-semibold hover:text-[#D32F2F] transition-colors">
    consulting.hwh@gmail.com
  </a>
);

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title={t("legal.terms.seo.title")}
        description={t("legal.terms.seo.description")}
        routeKey="terms"
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
              <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">{t("legal.terms.eyebrow")}</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black mb-10 sm:mb-14">
                {t("legal.terms.title")}
              </h1>
            </motion.div>

            <Section title={t("legal.terms.sections.purpose.title")}>
              <p>{t("legal.terms.sections.purpose.body")}</p>
            </Section>

            <Section title={t("legal.terms.sections.activity.title")}>
              <p>{t("legal.terms.sections.activity.body")}</p>
              <p>
                <Placeholder text={t("legal.terms.sections.activity.placeholder")} />
              </p>
            </Section>

            <Section title={t("legal.terms.sections.booking.title")}>
              <p>{t("legal.terms.sections.booking.body")}</p>
            </Section>

            <Section title={t("legal.terms.sections.cancellation.title")}>
              <p>
                <Placeholder text={t("legal.terms.sections.cancellation.placeholder")} />
              </p>
            </Section>

            <Section title={t("legal.terms.sections.pricing.title")}>
              <p>
                <Placeholder text={t("legal.terms.sections.pricing.placeholder")} />
              </p>
            </Section>

            <Section title={t("legal.terms.sections.liability.title")}>
              <p>{t("legal.terms.sections.liability.body")}</p>
              <p>
                <Placeholder text={t("legal.terms.sections.liability.placeholder")} />
              </p>
            </Section>

            <Section title={t("legal.terms.sections.law.title")}>
              <p>
                {t("legal.terms.sections.law.bodyPrefix")}
                <Placeholder text={t("legal.terms.sections.law.placeholder")} />.
              </p>
            </Section>

            <Section title={t("legal.terms.sections.contact.title")}>
              <p>
                {t("legal.terms.sections.contact.bodyPrefix")}
                {EMAIL_LINK}.
              </p>
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
