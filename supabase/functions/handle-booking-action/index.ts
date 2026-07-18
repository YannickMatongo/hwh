import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getGoogleAccessToken } from "../_shared/google.ts";
import { sendEmail, escapeHtml } from "../_shared/resend.ts";
import { formatParisDateTime, formatParisTime } from "../_shared/datetime.ts";
import { renderPage, htmlResponse } from "../_shared/page.ts";
import { CALENDAR_ID, TIMEZONE } from "../_shared/constants.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const action = url.searchParams.get("action");

  if (!token || (action !== "accept" && action !== "refuse")) {
    return htmlResponse(renderPage("Requête invalide", "Le lien utilisé est invalide ou incomplet."), 400);
  }

  try {
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("action_token", token)
      .single();

    if (error || !booking) {
      return htmlResponse(
        renderPage("Demande introuvable", "Cette demande de rendez-vous n'existe pas ou a été supprimée."),
        404,
      );
    }

    if (booking.status !== "pending") {
      const statusLabel = booking.status === "accepted" ? "acceptée" : "refusée";
      return htmlResponse(
        renderPage("Déjà traité", `Cette demande a déjà été traitée (statut actuel : ${statusLabel}).`),
      );
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
            description: `Contact : ${booking.email}${booking.phone ? ` / ${booking.phone}` : ""}\n\n${booking.message ?? ""}`,
            start: { dateTime: booking.requested_start, timeZone: TIMEZONE },
            end: { dateTime: booking.requested_end, timeZone: TIMEZONE },
            attendees: [{ email: booking.email }],
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

      return htmlResponse(
        renderPage(
          "Rendez-vous confirmé",
          `Le rendez-vous avec ${escapeHtml(booking.name)} a été accepté et ajouté au calendrier. Un email de confirmation lui a été envoyé.`,
        ),
      );
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

    return htmlResponse(
      renderPage("Demande refusée", `La demande de ${escapeHtml(booking.name)} a été refusée. Un email l'informant a été envoyé.`),
    );
  } catch (error) {
    console.error(error);
    return htmlResponse(renderPage("Erreur", "Une erreur est survenue lors du traitement de la demande."), 500);
  }
});
