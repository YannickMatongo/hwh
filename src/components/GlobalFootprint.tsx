/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";

export default function GlobalFootprint() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title="Présence | HWH Consulting"
        description="Zones et pays d'intervention de HWH Consulting pour ses missions d'audit, de formation et de conférence."
        path="/presence"
      />
      <Header />

      <main>
        <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase mb-4">Présence</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-black mb-10 sm:mb-14">
              Zones d'intervention
            </h1>

            <div className="text-gray-600 leading-relaxed flex flex-col gap-4">
              <p>
                HWH Consulting intervient auprès d'entreprises des secteurs retail, luxe et sport pour des missions
                d'audit, de formation et de conférence.
              </p>
              <p className="text-[#D32F2F] italic">
                [À compléter : zones et pays d'intervention]
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
