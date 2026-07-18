/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, Linkedin, Send, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SEO from "./SEO";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdaqeyqj";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Audit");
  const [customSubject, setCustomSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    customSubject?: string;
    message?: string;
  }>({});

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
    if (subject === "Autres" && !customSubject.trim()) {
      newErrors.customSubject = "Merci de préciser le motif de votre demande";
    }
    if (!message.trim()) newErrors.message = "Merci de décrire votre besoin";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          custom_subject: subject === "Autres" ? customSubject : undefined,
          message,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setSubmitError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
      }
    } catch {
      setSubmitError("Impossible d'envoyer le message. Vérifiez votre connexion et réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setSubject("Audit");
    setCustomSubject("");
    setMessage("");
    setIsSuccess(false);
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D32F2F] selection:text-white">
      <SEO
        title="Contact | HWH Consulting"
        description="Contactez HWH Consulting pour un audit de sécurité, une conférence ou une formation opérationnelle."
        path="/contact"
      />
      <Header />

      <main>
        <section className="pt-28 sm:pt-32 md:pt-40 lg:pt-48 pb-16 sm:pb-24 md:pb-32 px-4 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-200"
            >
              <div className="px-4 py-6 sm:py-8 md:py-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Left Section - Description & Info */}
                <div className="lg:col-span-6 flex flex-col gap-6 md:gap-8">
                  <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="Logo HWH Consulting" className="h-8 sm:h-10" />

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="flex items-center gap-2.5 border border-[#D32F2F] text-gray-700 rounded-full pl-1.5 pr-4 py-1.5 w-fit font-semibold text-sm cursor-default hover:bg-[#D32F2F]/5 transition-all duration-300"
                    >
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span>Prendre contact</span>
                    </motion.div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-3xl sm:text-4xl md:text-5xl font-black text-black leading-[1.1] tracking-tighter uppercase"
                    >
                      Parlons de votre projet
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-gray-600 text-base leading-relaxed max-w-xl font-normal"
                    >
                      Audit de sécurité, conférence ou formation opérationnelle : décrivez-nous votre besoin
                      via le formulaire ci-contre ou contactez-nous directement pour échanger sur votre projet.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                  >
                    <div className="flex items-center gap-3.5 group">
                      <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        <Phone className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Appelez-nous</span>
                        <a href="tel:+33695685012" className="text-black font-semibold text-sm hover:text-[#D32F2F] transition-colors">
                          06 95 68 50 12
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 group">
                      <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        <Linkedin className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">LinkedIn</span>
                        <a
                          href="https://www.linkedin.com/in/georgesdavid/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black font-semibold text-sm hover:text-[#D32F2F] transition-colors"
                        >
                          Georges D.
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 group md:col-span-2">
                      <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Écrivez-nous</span>
                        <a href="mailto:consulting.hwh@gmail.com" className="text-black font-semibold text-sm hover:text-[#D32F2F] transition-colors">
                          consulting.hwh@gmail.com
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Section - Form */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.7, type: "spring", stiffness: 100 }}
                  className="lg:col-span-6 bg-[#D32F2F] rounded-[2rem] p-10 lg:p-12 shadow-sm relative min-h-[460px] flex flex-col justify-between"
                >
                  <AnimatePresence mode="wait">
                    {!isSuccess ? (
                      <motion.form
                        key="contact-form"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleSubmit}
                        action={FORMSPREE_ENDPOINT}
                        method="POST"
                        className="flex flex-col gap-5 h-full justify-between"
                        noValidate
                      >
                        <div className="flex flex-col gap-5 lg:gap-7">
                          <div>
                            <label className="block text-white text-sm font-bold mb-1.5 tracking-tight">
                              Votre nom
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                              }}
                              placeholder="Nom"
                              className={`w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-black placeholder-gray-400 font-medium text-base focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 ${errors.name ? "ring-2 ring-black" : ""}`}
                            />
                            {errors.name && (
                              <p className="text-white text-xs mt-1 font-semibold">{errors.name}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-white text-sm font-bold mb-1.5 tracking-tight">
                              Votre email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                              }}
                              placeholder="Email"
                              className={`w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-black placeholder-gray-400 font-medium text-base focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 ${errors.email ? "ring-2 ring-black" : ""}`}
                            />
                            {errors.email && (
                              <p className="text-white text-xs mt-1 font-semibold">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-white text-sm font-bold mb-1.5 tracking-tight">
                              Votre téléphone
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={phone}
                              onChange={(e) => {
                                setPhone(e.target.value);
                                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                              }}
                              placeholder="Téléphone"
                              className={`w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-black placeholder-gray-400 font-medium text-base focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 ${errors.phone ? "ring-2 ring-black" : ""}`}
                            />
                            {errors.phone && (
                              <p className="text-white text-xs mt-1 font-semibold">{errors.phone}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-white text-sm font-bold mb-1.5 tracking-tight">
                              Objet de votre demande
                            </label>
                            <select
                              name="subject"
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-black font-medium text-base focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                            >
                              <option value="Audit">Audit</option>
                              <option value="Conférences">Conférences</option>
                              <option value="Autres">Autres</option>
                            </select>
                          </div>

                          <AnimatePresence>
                            {subject === "Autres" && (
                              <motion.div
                                key="custom-subject"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <label className="block text-white text-sm font-bold mb-1.5 tracking-tight">
                                  Précisez le motif
                                </label>
                                <input
                                  type="text"
                                  name="custom_subject"
                                  value={customSubject}
                                  onChange={(e) => {
                                    setCustomSubject(e.target.value);
                                    if (errors.customSubject) setErrors((prev) => ({ ...prev, customSubject: undefined }));
                                  }}
                                  placeholder="Précisez le motif de votre demande"
                                  className={`w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-black placeholder-gray-400 font-medium text-base focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 ${errors.customSubject ? "ring-2 ring-black" : ""}`}
                                />
                                {errors.customSubject && (
                                  <p className="text-white text-xs mt-1 font-semibold">{errors.customSubject}</p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div>
                            <label className="block text-white text-sm font-bold mb-1.5 tracking-tight">
                              Votre message
                            </label>
                            <textarea
                              name="message"
                              rows={4}
                              value={message}
                              onChange={(e) => {
                                setMessage(e.target.value);
                                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                              }}
                              placeholder="Décrivez votre besoin (audit, formation, conférence...)"
                              className={`w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-black placeholder-gray-400 font-medium text-base focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 resize-none min-h-[140px] lg:min-h-0 ${errors.message ? "ring-2 ring-black" : ""}`}
                            />
                            {errors.message && (
                              <p className="text-white text-xs mt-1 font-semibold">{errors.message}</p>
                            )}
                          </div>
                        </div>

                        {submitError && (
                          <p className="text-white text-xs font-semibold">{submitError}</p>
                        )}

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
                              {isSubmitting ? "Envoi..." : "Envoyer"}
                            </span>
                          </button>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success-screen"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 120 }}
                        className="flex flex-col items-center justify-center text-center py-8 px-2 flex-1 gap-6"
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
                          <h2 className="text-2xl font-black text-white tracking-tight">
                            Message envoyé !
                          </h2>
                          <p className="text-white/90 text-sm leading-relaxed max-w-[280px]">
                            Merci, <span className="font-bold text-white">{name}</span> ! Nous revenons vers vous
                            rapidement pour échanger sur votre projet.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                          <button
                            type="button"
                            onClick={handleReset}
                            className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md active:scale-98 transition-all duration-300 text-xs tracking-wider uppercase"
                          >
                            Envoyer un autre message
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
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
