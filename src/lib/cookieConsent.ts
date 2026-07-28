/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "./cookieConsent.css";
import { routes } from "../i18n/routes";
import { disableAnalytics, enableAnalytics } from "./analytics";

let initialized = false;

/** Loads/unloads Google Analytics to match the current "analytics" consent state. */
function syncAnalyticsConsent(): void {
  if (CookieConsent.acceptedCategory("analytics")) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }
}

/**
 * Initializes the cookie consent banner. Safe to call multiple times — only
 * runs once. `lang` sets the language shown on first render; use
 * `setCookieConsentLanguage` afterwards to keep it in sync with the site.
 */
export function initCookieConsent(lang: "fr" | "en"): void {
  if (initialized) return;
  initialized = true;

  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: "bar inline",
        position: "bottom",
        equalWeightButtons: false,
        flipButtons: false,
      },
      preferencesModal: {
        layout: "box",
        position: "right",
        equalWeightButtons: true,
      },
    },
    categories: {
      necessary: {
        readOnly: true,
      },
      analytics: {
        autoClear: {
          cookies: [{ name: /^_ga/ }, { name: "_gid" }],
        },
      },
    },
    language: {
      default: lang,
      translations: {
        fr: {
          consentModal: {
            title: "Nous respectons votre vie privée",
            description:
              "Ce site utilise des cookies nécessaires à son bon fonctionnement et, avec votre accord, des cookies de mesure d'audience (Google Analytics) pour comprendre comment il est utilisé.",
            acceptAllBtn: "Tout accepter",
            acceptNecessaryBtn: "Refuser",
            showPreferencesBtn: "Personnaliser",
            footer: `<a href="${routes.privacy.fr}">Politique de confidentialité</a>`,
          },
          preferencesModal: {
            title: "Préférences de cookies",
            acceptAllBtn: "Tout accepter",
            acceptNecessaryBtn: "Refuser",
            savePreferencesBtn: "Enregistrer mes préférences",
            closeIconLabel: "Fermer",
            serviceCounterLabel: "Service(s)",
            sections: [
              {
                title: "Utilisation des cookies",
                description:
                  "Nous utilisons des cookies pour assurer le bon fonctionnement du site et, si vous l'acceptez, pour mesurer son audience de manière anonyme.",
              },
              {
                title: "Cookies strictement nécessaires",
                description:
                  "Indispensables au fonctionnement du site (navigation, sécurité). Ils ne peuvent pas être désactivés.",
                linkedCategory: "necessary",
              },
              {
                title: "Mesure d'audience (Google Analytics)",
                description:
                  "Nous permettent de mesurer la fréquentation du site de façon anonyme, afin d'en améliorer le contenu. Déposés uniquement avec votre accord.",
                linkedCategory: "analytics",
              },
            ],
          },
        },
        en: {
          consentModal: {
            title: "We respect your privacy",
            description:
              "This site uses cookies required for it to run properly and, with your consent, audience measurement cookies (Google Analytics) to understand how it's used.",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject",
            showPreferencesBtn: "Manage preferences",
            footer: `<a href="${routes.privacy.en}">Privacy Policy</a>`,
          },
          preferencesModal: {
            title: "Cookie preferences",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject",
            savePreferencesBtn: "Save my preferences",
            closeIconLabel: "Close",
            serviceCounterLabel: "Service(s)",
            sections: [
              {
                title: "Cookie usage",
                description:
                  "We use cookies to ensure the site works properly and, if you agree, to anonymously measure its audience.",
              },
              {
                title: "Strictly necessary cookies",
                description: "Essential for the site to function (navigation, security). They cannot be disabled.",
                linkedCategory: "necessary",
              },
              {
                title: "Audience measurement (Google Analytics)",
                description:
                  "Let us anonymously measure site traffic in order to improve its content. Only set with your consent.",
                linkedCategory: "analytics",
              },
            ],
          },
        },
      },
    },
    // Fires on first consent and on every page load where valid consent already
    // exists (so GA loads on return visits too, not just the first time).
    onConsent: syncAnalyticsConsent,
    // Fires whenever the user updates their preferences later on.
    onChange: syncAnalyticsConsent,
  });
}

/** Reopens the cookie preferences modal — used by the footer's "Manage cookies" link. */
export function showCookiePreferences(): void {
  CookieConsent.showPreferences();
}

/** Keeps the banner/modal text in sync with the site's active language. */
export function setCookieConsentLanguage(lang: "fr" | "en"): void {
  void CookieConsent.setLanguage(lang);
}
