/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { RouteKey, routes, useCurrentLang } from "../i18n/routes";

const SITE_URL = "https://consulting-hwh.com";
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

interface SEOProps {
  title: string;
  description: string;
  routeKey: RouteKey;
  image?: string;
  jsonLd?: Record<string, unknown>;
}

export default function SEO({ title, description, routeKey, image = DEFAULT_IMAGE, jsonLd }: SEOProps) {
  const lang = useCurrentLang();
  const { i18n } = useTranslation();
  const path = routes[routeKey][lang];
  const url = `${SITE_URL}${path}`;
  const frUrl = `${SITE_URL}${routes[routeKey].fr}`;
  const enUrl = `${SITE_URL}${routes[routeKey].en}`;

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <link rel="alternate" hrefLang="fr" href={frUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={frUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={lang === "en" ? "en_US" : "fr_FR"} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
