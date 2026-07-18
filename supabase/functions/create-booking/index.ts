import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { sendEmail, escapeHtml } from "../_shared/resend.ts";
import { formatParisDateTime, formatParisTime } from "../_shared/datetime.ts";
import { OWNER_EMAIL } from "../_shared/constants.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

interface CreateBookingBody {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  requested_start: string;
  requested_end: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: CreateBookingBody = await req.json();
    const { name, email, phone, message, requested_start, requested_end } = body;

    if (!name?.trim() || !email?.trim() || !requested_start || !requested_end) {
      return new Response(JSON.stringify({ error: "Champs requis manquants" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        name,
        email,
        phone: phone ?? null,
        message: message ?? null,
        requested_start,
        requested_end,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    const functionsBaseUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/handle-booking-action`;
    const acceptUrl = `${functionsBaseUrl}?token=${booking.action_token}&action=accept`;
    const refuseUrl = `${functionsBaseUrl}?token=${booking.action_token}&action=refuse`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color:#D32F2F;">Nouvelle demande de rendez-vous</h2>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(phone || "Non renseigné")}</p>
        <p><strong>Créneau demandé :</strong> ${formatParisDateTime(requested_start)} - ${formatParisTime(requested_end)}</p>
        <p><strong>Message :</strong><br/>${escapeHtml(message || "Aucun message")}</p>
        <div style="margin-top: 24px;">
          <a href="${acceptUrl}" style="display:inline-block; background:#000; color:#fff; padding:12px 24px; text-decoration:none; border-radius:24px; font-weight:bold; margin-right:12px;">Accepter</a>
          <a href="${refuseUrl}" style="display:inline-block; background:#D32F2F; color:#fff; padding:12px 24px; text-decoration:none; border-radius:24px; font-weight:bold;">Refuser</a>
        </div>
      </div>
    `;

    await sendEmail({
      to: OWNER_EMAIL,
      subject: `Nouvelle demande de rendez-vous - ${name}`,
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
