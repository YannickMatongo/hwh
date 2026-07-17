import { ChevronRight, ShieldCheck } from "lucide-react";

export default function Founder() {
  return (
    <section id="fondateur" className="py-16 sm:py-20 md:py-32 px-6 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="space-y-6">
              <div className="text-[#D32F2F] font-black tracking-[0.2em] text-sm uppercase">Le Fondateur</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-black">Georges D.</h2>
              <div className="h-1 w-12 bg-[#D32F2F]"></div>

              <p className="text-gray-600 text-lg leading-relaxed">
                20 ans d'expérience terrain entre retail et sûreté, du sport au luxe : une expertise au service de la protection et de la performance de votre activité.
              </p>

              <blockquote className="border-l-4 border-[#D32F2F] pl-6 italic text-gray-600 text-lg">
                "La sécurité n'est pas une option, c'est le socle de toute stratégie pérenne. Notre mission est d'anticiper, de former et de protéger."
              </blockquote>

              <div className="pt-6">
                <button className="inline-flex items-center gap-2 group text-black font-bold uppercase tracking-widest text-xs hover:text-[#D32F2F] transition-colors">
                  Lire le profil complet
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden grayscale brightness-105 contrast-110">
              <img
                src="/george.jpg"
                alt="Georges D."
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 w-8 h-8 bg-[#D32F2F] flex items-center justify-center">
                <ShieldCheck size={16} className="text-white" />
              </div>
              <div className="absolute bottom-0 left-0 p-8 bg-[#D32F2F]/90 text-white font-black text-4xl hidden md:block">
                HWH
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
