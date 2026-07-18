/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!envUrl || !envAnonKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables");
}

// Fall back to placeholder values so createClient() never throws at module load time
// (it would otherwise crash the whole app, not just the /reservation page) when the
// Supabase project isn't configured yet. Calls will simply fail gracefully at request time.
const supabaseUrl = envUrl || "https://placeholder.supabase.co";
const supabaseAnonKey = envAnonKey || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const functionsUrl = `${supabaseUrl}/functions/v1`;

export function functionsHeaders(extra?: Record<string, string>) {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    ...extra,
  };
}
