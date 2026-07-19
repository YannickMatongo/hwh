/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, ReactNode, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Expertise from "./components/Expertise";
import Footer from "./components/Footer";
import SEO from "./components/SEO";
import { Lang } from "./i18n/routes";

const Founder = lazy(() => import("./components/Founder"));
const Catalogue = lazy(() => import("./components/Catalogue"));
const Contact = lazy(() => import("./components/Contact"));
const Reservation = lazy(() => import("./components/Reservation"));
const APropos = lazy(() => import("./components/APropos"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const GlobalFootprint = lazy(() => import("./components/GlobalFootprint"));
const Careers = lazy(() => import("./components/Careers"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 text-[#D32F2F] animate-spin" />
    </div>
  );
}

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-6 h-6 text-[#D32F2F] animate-spin" />
    </div>
  );
}

/** Sets the i18next language to match the URL prefix as soon as this route mounts. */
function LangWrapper({ lang, children }: { lang: Lang; children: ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return <>{children}</>;
}

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "HWH Consulting",
  telephone: "+33695685012",
  email: "consulting.hwh@gmail.com",
  url: "https://consulting-hwh.com",
  image: "https://consulting-hwh.com/logo.png",
  sameAs: ["https://www.linkedin.com/in/georgesdavid/"],
};

function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title={t("home.seo.title")}
        description={t("home.seo.description")}
        routeKey="home"
        jsonLd={{ ...HOME_JSON_LD, description: t("home.seo.description") }}
      />
      <Header />

      <main>
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <Founder />
        </Suspense>
        <Stats />
        <Expertise />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* French routes (default, unprefixed) */}
        <Route path="/" element={<LangWrapper lang="fr"><Home /></LangWrapper>} />
        <Route path="/catalogue" element={<LangWrapper lang="fr"><Catalogue /></LangWrapper>} />
        <Route path="/contact" element={<LangWrapper lang="fr"><Contact /></LangWrapper>} />
        <Route path="/reservation" element={<LangWrapper lang="fr"><Reservation /></LangWrapper>} />
        <Route path="/a-propos" element={<LangWrapper lang="fr"><APropos /></LangWrapper>} />
        <Route path="/politique-de-confidentialite" element={<LangWrapper lang="fr"><PrivacyPolicy /></LangWrapper>} />
        <Route path="/conditions-generales" element={<LangWrapper lang="fr"><TermsOfService /></LangWrapper>} />
        <Route path="/presence" element={<LangWrapper lang="fr"><GlobalFootprint /></LangWrapper>} />
        <Route path="/carrieres" element={<LangWrapper lang="fr"><Careers /></LangWrapper>} />

        {/* English routes */}
        <Route path="/en" element={<LangWrapper lang="en"><Home /></LangWrapper>} />
        <Route path="/en/catalog" element={<LangWrapper lang="en"><Catalogue /></LangWrapper>} />
        <Route path="/en/contact" element={<LangWrapper lang="en"><Contact /></LangWrapper>} />
        <Route path="/en/booking" element={<LangWrapper lang="en"><Reservation /></LangWrapper>} />
        <Route path="/en/about" element={<LangWrapper lang="en"><APropos /></LangWrapper>} />
        <Route path="/en/privacy-policy" element={<LangWrapper lang="en"><PrivacyPolicy /></LangWrapper>} />
        <Route path="/en/terms-of-service" element={<LangWrapper lang="en"><TermsOfService /></LangWrapper>} />
        <Route path="/en/global-footprint" element={<LangWrapper lang="en"><GlobalFootprint /></LangWrapper>} />
        <Route path="/en/careers" element={<LangWrapper lang="en"><Careers /></LangWrapper>} />
      </Routes>
    </Suspense>
  );
}
