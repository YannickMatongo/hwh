/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import Header from "../Header";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/admin", { replace: true });
        return;
      }
      setIsCheckingSession(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);

    if (signInError) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="flex items-center justify-center px-4 pt-28 sm:pt-32 pb-16 min-h-screen">
        {isCheckingSession ? (
          <Loader2 className="w-6 h-6 text-[#D32F2F] animate-spin" />
        ) : (
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <div className="mb-8 text-center">
              <img src="/logo.svg" alt="HWH Consulting" className="h-10 mx-auto mb-4" />
              <h1 className="text-lg font-bold text-black uppercase tracking-wide">Espace administrateur</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                />
              </div>

              {error && <p className="text-sm text-[#D32F2F] font-medium">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 bg-[#D32F2F] hover:bg-[#b02626] disabled:opacity-60 text-white font-bold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Se connecter
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
