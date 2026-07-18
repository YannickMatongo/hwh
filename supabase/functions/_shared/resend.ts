import { FROM_EMAIL } from "./constants.ts";

const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!res.ok) {
    throw new Error(`Resend error: ${res.status} ${await res.text()}`);
  }
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
