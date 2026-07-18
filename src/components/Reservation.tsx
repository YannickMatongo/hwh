/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Clock, Linkedin, Loader2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";
import { functionsUrl, functionsHeaders } from "../lib/supabaseClient";

interface Slot {
  date: string;
  start: string;
  end: string;
}

const FETCH_DAYS = 60;
const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function formatDayLabel(dateStr: string): string {
  const label = new Date(`${dateStr}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatSlotTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMonthLabel(year: number, month: number): string {
  const label = new Date(year, month, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildSlotsByDate(slots: Slot[]): Map<string, Slot[]> {
  const map = new Map<string, Slot[]>();
  for (const slot of slots) {
    const existing = map.get(slot.date);
    if (existing) existing.push(slot);
    else map.set(slot.date, [slot]);
  }
  return map;
}

export default function Reservation() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const now = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState(() => ({ year: now.getFullYear(), month: now.getMonth() }));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`${functionsUrl}/get-availability?days=${FETCH_DAYS}`, {
          headers: functionsHeaders(),
        });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Erreur lors du chargement des disponibilités");
        if (!cancelled) setSlots(data.slots ?? []);
      } catch {
        if (!cancelled) setLoadError("Impossible de charger les créneaux disponibles. Veuillez réessayer plus tard.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, []);

  const slotsByDate = useMemo(() => buildSlotsByDate(slots), [slots]);

  const maxDate = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() + FETCH_DAYS - 1);
    return d;
  }, [now]);

  const isPrevDisabled = viewMonth.year === now.getFullYear() && viewMonth.month === now.getMonth();
  const isNextDisabled = viewMonth.year === maxDate.getFullYear() && viewMonth.month === maxDate.getMonth();

  const goPrevMonth = () => {
    if (isPrevDisabled) return;
    setViewMonth(({ year, month }) => (month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }));
  };

  const goNextMonth = () => {
    if (isNextDisabled) return;
    setViewMonth(({ year, month }) => (month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }));
  };

  const daysInMonth = new Date(viewMonth.year, viewMonth.month + 1, 0).getDate();
  const firstWeekday = new Date(viewMonth.year, viewMonth.month, 1).getDay();
  const leadingBlanks = (firstWeekday + 6) % 7;

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Le nom est requis";
    if (!phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(phone.trim())) {
      newErrors.phone = "Format de téléphone invalide";
    }
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Adresse email invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${functionsUrl}/create-booking`, {
        method: "POST",
        headers: functionsHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          requested_start: selectedSlot.start,
          requested_end: selectedSlot.end,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Erreur lors de l'envoi");
      setIsSuccess(true);
    } catch {
      setSubmitError("Impossible d'envoyer votre demande. Vérifiez votre connexion et réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedDate(null);
    setSelectedSlot(null);
    setViewMonth({ year: now.getFullYear(), month: now.getMonth() });
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setIsSuccess(false);
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title="Réserver un rendez-vous | HWH Consulting"
        description="Choisissez un créneau et réservez un rendez-vous avec HWH Consulting pour un audit de sécurité, une conférence ou une formation opérationnelle."
        path="/reservation"
      />
      <Header />

      <main>
        <section className="pt-28 sm:pt-32 md:pt-40 lg:pt-48 pb-16 sm:pb-24 md:pb-32 px-4 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row"
            >
              {/* Left Column: Profile & Info */}
              <div className="w-full md:w-[45%] p-8 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col">
                <img
                  src="/george.jpg"
                  alt="Georges D., fondateur et consultant en sûreté chez HWH Consulting"
                  className="w-16 h-16 rounded-full object-cover mb-6"
                />
                <h2 className="text-[22px] font-black text-black leading-tight">Georges D.</h2>
                <p className="text-gray-500 font-medium text-sm mb-6">Consultant Formateur · Sûreté & Performance</p>

                <h1 className="text-3xl md:text-4xl font-black text-black leading-[1.05] tracking-tighter uppercase mb-4">
                  Réserver
                  <br />
                  un rendez-vous
                </h1>

                <p className="text-gray-500 text-sm leading-relaxed pr-4 mb-8">
                  Échangeons sur vos besoins en audit, formation ou conférence. Choisissez un créneau et laissez-nous
                  vos coordonnées : vous recevrez une confirmation par email une fois votre demande validée.
                </p>

                <div className="flex flex-col gap-3 text-sm text-gray-600 mb-12 font-medium">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400 stroke-[2]" />
                    Lundi-Dimanche 9h-18h
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <a
                    href="https://www.linkedin.com/in/georgesdavid/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Calendar, Times & Form */}
              <div className="w-full md:w-[55%] p-8 md:p-10 lg:p-12">
                <AnimatePresence mode="wait">
                  {!selectedSlot ? (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isLoading && (
                        <div className="flex items-center gap-3 text-gray-500 py-12 justify-center">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-sm font-medium">Chargement des disponibilités...</span>
                        </div>
                      )}

                      {!isLoading && loadError && (
                        <div className="text-center py-12">
                          <p className="text-gray-600 text-sm">{loadError}</p>
                        </div>
                      )}

                      {!isLoading && !loadError && slots.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-600 text-sm">
                            Aucun créneau disponible pour le moment. Merci de nous contacter directement.
                          </p>
                        </div>
                      )}

                      {!isLoading && !loadError && slots.length > 0 && (
                        <>
                          <div className="flex items-center justify-between px-2 mb-6">
                            <button
                              type="button"
                              onClick={goPrevMonth}
                              disabled={isPrevDisabled}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="font-bold text-gray-900 text-[15px]">
                              {formatMonthLabel(viewMonth.year, viewMonth.month)}
                            </span>
                            <button
                              type="button"
                              onClick={goNextMonth}
                              disabled={isNextDisabled}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>

                          <div className="mb-8 px-2">
                            <div className="grid grid-cols-7 gap-y-1 mb-2 text-center text-[11px] font-bold text-gray-400 uppercase">
                              {WEEKDAY_LABELS.map((label, i) => (
                                <div key={`${label}-${i}`}>{label}</div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-y-2 gap-x-2 text-center text-[15px]">
                              {Array.from({ length: leadingBlanks }).map((_, i) => (
                                <div key={`blank-${i}`} />
                              ))}
                              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                const dateStr = toDateStr(viewMonth.year, viewMonth.month, day);
                                const hasSlots = slotsByDate.has(dateStr);
                                const isSelected = selectedDate === dateStr;

                                if (!hasSlots) {
                                  return (
                                    <div key={dateStr} className="py-2 text-gray-300 font-medium">
                                      {day}
                                    </div>
                                  );
                                }

                                return (
                                  <button
                                    key={dateStr}
                                    type="button"
                                    onClick={() => setSelectedDate(dateStr)}
                                    className={`py-2 rounded-xl font-semibold transition-colors ${
                                      isSelected
                                        ? "bg-[#D32F2F] text-white shadow-md"
                                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                    }`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="px-2">
                            <h2 className="font-bold text-gray-900 mb-4 text-[15px]">Créneaux disponibles</h2>
                            {!selectedDate && (
                              <p className="text-gray-400 text-sm">Sélectionnez une date pour voir les créneaux.</p>
                            )}
                            {selectedDate && (
                              <div className="flex flex-wrap gap-2.5">
                                {(slotsByDate.get(selectedDate) ?? []).map((slot) => (
                                  <button
                                    key={slot.start}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className="px-5 py-2.5 bg-gray-100 rounded-xl text-sm font-semibold text-gray-800 hover:bg-[#D32F2F] hover:text-white active:bg-[#D32F2F] active:text-white transition-colors tracking-wide"
                                  >
                                    {formatSlotTime(slot.start)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  ) : !isSuccess ? (
                    <motion.div
                      key="booking-form"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                      className="bg-[#D32F2F] rounded-[2rem] p-8 md:p-10 shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedSlot(null)}
                        className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Changer de créneau
                      </button>

                      <div className="flex items-center gap-2.5 bg-white/10 border border-white/20 text-white rounded-full pl-1.5 pr-4 py-1.5 w-fit font-semibold text-sm mb-6">
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <span>
                          {formatDayLabel(selectedSlot.date)} · {formatSlotTime(selectedSlot.start)} -{" "}
                          {formatSlotTime(selectedSlot.end)}
                        </span>
                      </div>

                      <h2 className="text-white font-black text-sm uppercase tracking-widest mb-5">Vos coordonnées</h2>

                      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                        <div>
                          <label className="block text-white text-sm font-bold mb-1.5 tracking-tight">
                            Votre nom
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                            }}
                            placeholder="Nom"
                            className={`w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-black placeholder-gray-400 font-medium text-base focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 ${errors.name ? "ring-2 ring-black" : ""}`}
                          />
                          {errors.name && <p className="text-white text-xs mt-1 font-semibold">{errors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-white text-sm font-bold mb-1.5 tracking-tight">
                            Votre email
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                            }}
                            placeholder="Email"
                            className={`w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-black placeholder-gray-400 font-medium text-base focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 ${errors.email ? "ring-2 ring-black" : ""}`}
                          />
                          {errors.email && <p className="text-white text-xs mt-1 font-semibold">{errors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-white text-sm font-bold mb-1.5 tracking-tight">
                            Votre téléphone
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                            }}
                            placeholder="Téléphone"
                            className={`w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-black placeholder-gray-400 font-medium text-base focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 ${errors.phone ? "ring-2 ring-black" : ""}`}
                          />
                          {errors.phone && <p className="text-white text-xs mt-1 font-semibold">{errors.phone}</p>}
                        </div>

                        <div>
                          <label className="block text-white text-sm font-bold mb-1.5 tracking-tight">
                            Votre message (optionnel)
                          </label>
                          <textarea
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Précisez l'objet de votre rendez-vous..."
                            className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-black placeholder-gray-400 font-medium text-base focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 resize-none"
                          />
                        </div>

                        {submitError && <p className="text-white text-xs font-semibold">{submitError}</p>}

                        <div className="mt-2">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex lg:inline-flex w-full lg:w-auto items-center justify-center lg:justify-start gap-3 bg-black text-white font-bold pl-2 pr-6 py-4 lg:py-2 rounded-full shadow-sm hover:bg-gray-800 hover:shadow-md active:scale-98 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed group"
                          >
                            <div className="w-10 h-10 bg-[#D32F2F] text-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                              {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </div>
                            <span className="text-sm tracking-tight">
                              {isSubmitting ? "Envoi..." : "Confirmer la demande"}
                            </span>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success-screen"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 120 }}
                      className="bg-[#D32F2F] rounded-[2rem] p-8 md:p-10 flex flex-col items-center justify-center text-center gap-6 min-h-[360px]"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                        className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white"
                      >
                        <Check className="w-8 h-8 stroke-[3]" />
                      </motion.div>

                      <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-black text-white tracking-tight">Demande envoyée !</h2>
                        <p className="text-white/90 text-sm leading-relaxed max-w-[320px]">
                          Votre demande a été envoyée, vous recevrez une confirmation par email une fois validée
                          par notre équipe.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md active:scale-98 transition-all duration-300 text-xs tracking-wider uppercase"
                        >
                          Faire une autre demande
                        </button>
                        <Link
                          to="/"
                          className="text-white/80 hover:text-white font-bold px-6 py-3 text-xs tracking-wider uppercase transition-colors"
                        >
                          Retour à l'accueil
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
