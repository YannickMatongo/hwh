import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getGoogleAccessToken } from "../_shared/google.ts";
import { sendEmail, escapeHtml } from "../_shared/resend.ts";
import { formatParisDateTime, formatParisTime } from "../_shared/datetime.ts";
import { CALENDAR_ID, SITE_URL, TIMEZONE } from "../_shared/constants.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function redirectToStatus(params: Record<string, string>): Response {
  const url = new URL("/rdv-statut", SITE_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return Response.redirect(url.toString(), 302);
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const action = url.searchParams.get("action");

  if (!token || (action !== "accept" && action !== "refuse")) {
    return redirectToStatus({ status: "invalid" });
  }

  try {
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("action_token", token)
      .single();

    if (error || !booking) {
      return redirectToStatus({ status: "notfound" });
    }

    if (booking.status !== "pending") {
      const outcome = booking.status === "accepted" ? "acceptée" : "refusée";
      return redirectToStatus({ status: "already", outcome });
    }

    if (action === "accept") {
      const accessToken = await getGoogleAccessToken();

      const eventRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: `RDV - ${booking.name}`,
            description: `Nom: ${booking.name}\nEmail: ${booking.email}\nTéléphone: ${booking.phone ?? ""}\nMessage: ${booking.message ?? ""}`,
            start: { dateTime: booking.requested_start, timeZone: TIMEZONE },
            end: { dateTime: booking.requested_end, timeZone: TIMEZONE },
          }),
        },
      );

      if (!eventRes.ok) {
        throw new Error(`Google event creation failed: ${eventRes.status} ${await eventRes.text()}`);
      }

      await supabase.from("bookings").update({ status: "accepted" }).eq("id", booking.id);

      await sendEmail({
        to: booking.email,
        subject: "Votre rendez-vous est confirmé - HWH Consulting",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color:#D32F2F;">Rendez-vous confirmé</h2>
            <p>Bonjour ${escapeHtml(booking.name)},</p>
            <p>Votre rendez-vous avec HWH Consulting est confirmé pour le :</p>
            <p style="font-weight:bold;">${formatParisDateTime(booking.requested_start)} - ${formatParisTime(booking.requested_end)}</p>
            <p>À bientôt,<br/>L'équipe HWH Consulting</p>
          </div>
        `,
      });

      return redirectToStatus({ status: "accepted", name: booking.name });
    }

    await supabase.from("bookings").update({ status: "refused" }).eq("id", booking.id);

    await sendEmail({
      to: booking.email,
      subject: "Votre demande de rendez-vous - HWH Consulting",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color:#D32F2F;">Créneau non disponible</h2>
          <p>Bonjour ${escapeHtml(booking.name)},</p>
          <p>Nous sommes désolés, le créneau que vous avez demandé n'est plus disponible. N'hésitez pas à choisir un autre créneau sur notre page de réservation.</p>
          <p>À bientôt,<br/>L'équipe HWH Consulting</p>
        </div>
      `,
    });

    return redirectToStatus({ status: "refused", name: booking.name });
  } catch (error) {
    console.error(error);
    return redirectToStatus({ status: "error" });
  }
});
