export function renderPage(title: string, message: string): string {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} - HWH Consulting</title>
  </head>
  <body style="margin:0; font-family: Arial, sans-serif; background:#f9fafb; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:24px; box-sizing:border-box;">
    <div style="max-width:480px; width:100%; background:#fff; border:1px solid #e5e7eb; border-radius:24px; padding:40px; text-align:center;">
      <div style="font-weight:900; font-size:24px; letter-spacing:-0.02em; margin-bottom:16px;">
        HWH<span style="display:inline-block; width:8px; height:8px; background:#D32F2F; border-radius:9999px; margin-left:4px;"></span>
      </div>
      <h1 style="font-size:20px; font-weight:900; text-transform:uppercase; color:#111827; margin:0 0 12px;">${title}</h1>
      <p style="color:#4b5563; font-size:14px; line-height:1.6; margin:0;">${message}</p>
    </div>
  </body>
</html>`;
}

export function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
