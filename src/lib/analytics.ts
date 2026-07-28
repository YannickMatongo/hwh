/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const GA_MEASUREMENT_ID = "G-S77P34Q9QR";
const GA_SCRIPT_ID = "ga-script";
const GA_DISABLE_KEY = `ga-disable-${GA_MEASUREMENT_ID}`;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let scriptLoaded = false;

function setDisableFlag(disabled: boolean) {
  (window as unknown as Record<string, boolean>)[GA_DISABLE_KEY] = disabled;
}

/**
 * Loads gtag.js and enables Google Analytics tracking.
 * Must only be called once the "analytics" consent category has been accepted.
 */
export function enableAnalytics(): void {
  setDisableFlag(false);

  if (scriptLoaded || document.getElementById(GA_SCRIPT_ID)) return;
  scriptLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

/**
 * Stops Google Analytics tracking and removes its script/data — e.g. when
 * consent for the "analytics" category is withdrawn.
 */
export function disableAnalytics(): void {
  setDisableFlag(true);
  document.getElementById(GA_SCRIPT_ID)?.remove();
  scriptLoaded = false;
  window.dataLayer = [];
  window.gtag = undefined as unknown as Window["gtag"];
}
