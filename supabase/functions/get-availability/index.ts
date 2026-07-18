import { corsHeaders } from "../_shared/cors.ts";
import { getGoogleAccessToken } from "../_shared/google.ts";
import { CALENDAR_ID, CLOSE_HOUR, OPEN_HOUR, TIMEZONE } from "../_shared/constants.ts";
import { getParisDateParts, parisWallTimeToUtc } from "../_shared/datetime.ts";

interface BusyPeriod {
  start: string;
  end: string;
}

interface Slot {
  date: string;
  start: string;
  end: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const requestedDays = Number(url.searchParams.get("days"));
    const days = Math.max(1, Math.min(60, Number.isFinite(requestedDays) && requestedDays > 0 ? requestedDays : 14));

    const accessToken = await getGoogleAccessToken();

    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

    const freeBusyRes = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        timeZone: TIMEZONE,
        items: [{ id: CALENDAR_ID }],
      }),
    });

    if (!freeBusyRes.ok) {
      throw new Error(`Google freeBusy failed: ${freeBusyRes.status} ${await freeBusyRes.text()}`);
    }

    const freeBusyData = await freeBusyRes.json();
    const busy: BusyPeriod[] = freeBusyData.calendars?.[CALENDAR_ID]?.busy ?? [];

    const slots = computeAvailableSlots(now, days, busy);

    return new Response(JSON.stringify({ slots }), {
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

function computeAvailableSlots(now: Date, days: number, busy: BusyPeriod[]): Slot[] {
  const { year, month, day } = getParisDateParts(now);
  const slots: Slot[] = [];

  for (let d = 0; d < days; d++) {
    const dateLabel = new Date(Date.UTC(year, month - 1, day + d)).toISOString().slice(0, 10);

    for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
      const slotStart = parisWallTimeToUtc(year, month, day + d, hour);
      const slotEnd = parisWallTimeToUtc(year, month, day + d, hour + 1);

      if (slotStart.getTime() <= now.getTime()) continue;

      const overlaps = busy.some((period) => {
        const busyStart = new Date(period.start).getTime();
        const busyEnd = new Date(period.end).getTime();
        return slotStart.getTime() < busyEnd && slotEnd.getTime() > busyStart;
      });

      if (overlaps) continue;

      slots.push({
        date: dateLabel,
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
      });
    }
  }

  return slots;
}
