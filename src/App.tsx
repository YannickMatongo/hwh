/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Founder from "./components/Founder";
import Stats from "./components/Stats";
import Expertise from "./components/Expertise";
import Footer from "./components/Footer";
import Catalogue from "./components/Catalogue";
import Contact from "./components/Contact";
import SEO from "./components/SEO";

const HOME_DESCRIPTION =
  "HWH Consulting accompagne les enseignes retail, luxe et sport avec 20 ans d'expérience terrain : audits de sécurité, conférences et formations opérationnelles.";

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "HWH Consulting",
  description: HOME_DESCRIPTION,
  telephone: "+33695685012",
  email: "consulting.hwh@gmail.com",
  url: "https://consulting-hwh.com",
  image: "https://consulting-hwh.com/logo.png",
  sameAs: ["https://www.linkedin.com/in/georgesdavid/"],
};

function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title="HWH Consulting | Audit, Formation et Sûreté Retail"
        description={HOME_DESCRIPTION}
        path="/"
        jsonLd={HOME_JSON_LD}
      />
      <Header />

      <main>
        <Hero />
        <Founder />
        <Stats />
        <Expertise />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
