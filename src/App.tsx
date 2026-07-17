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

function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
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
