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

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title={t("legal.privacy.seo.title")}
        description={t("legal.privacy.seo.description")}
        routeKey="privacy"
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
              <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">{t("legal.privacy.eyebrow")}</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black mb-10 sm:mb-14">
                {t("legal.privacy.title")}
              </h1>
            </motion.div>

            <Section title={t("legal.privacy.sections.controller.title")}>
              <p>
                {t("legal.privacy.sections.controller.bodyPrefix")}
                {EMAIL_LINK}.
              </p>
              <p>
                <Placeholder text={t("legal.privacy.sections.controller.placeholder")} />
              </p>
            </Section>

            <Section title={t("legal.privacy.sections.dataCollected.title")}>
              <p>{t("legal.privacy.sections.dataCollected.body")}</p>
            </Section>

            <Section title={t("legal.privacy.sections.purpose.title")}>
              <p>{t("legal.privacy.sections.purpose.body")}</p>
            </Section>

            <Section title={t("legal.privacy.sections.recipients.title")}>
              <p>{t("legal.privacy.sections.recipients.body")}</p>
              <p>
                <Placeholder text={t("legal.privacy.sections.recipients.placeholder")} />
              </p>
            </Section>

            <Section title={t("legal.privacy.sections.retention.title")}>
              <p>
                <Placeholder text={t("legal.privacy.sections.retention.placeholder")} />
              </p>
            </Section>

            <Section title={t("legal.privacy.sections.cookies.title")}>
              <p>
                <Placeholder text={t("legal.privacy.sections.cookies.placeholder")} />
              </p>
            </Section>

            <Section title={t("legal.privacy.sections.rights.title")}>
              <p>
                {t("legal.privacy.sections.rights.bodyPrefix")}
                {EMAIL_LINK}.
              </p>
            </Section>

            <Section title={t("legal.privacy.sections.update.title")}>
              <p>
                <Placeholder text={t("legal.privacy.sections.update.placeholder")} />
              </p>
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
