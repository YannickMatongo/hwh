import { TIMEZONE } from "./constants.ts";

export function formatParisDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatParisTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getParisDateParts(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) map[part.type] = part.value;

  return { year: Number(map.year), month: Number(map.month), day: Number(map.day) };
}

export function parisWallTimeToUtc(year: number, month: number, day: number, hour: number): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, 0, 0));
  const parisWallClock = guess.toLocaleString("sv-SE", { timeZone: TIMEZONE }).replace(" ", "T");
  const guessReadAsUtc = new Date(`${parisWallClock}Z`);
  const offset = guess.getTime() - guessReadAsUtc.getTime();
  return new Date(guess.getTime() + offset);
}
