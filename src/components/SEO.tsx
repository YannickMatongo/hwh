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
  /** Omit for pages with no canonical route (e.g. a 404 catch-all) — canonical/hreflang links are skipped in that case. */
  routeKey?: RouteKey;
  image?: string;
  jsonLd?: Record<string, unknown>;
  /** Overrides the routeKey-derived paths — needed for dynamic (slug-based) pages. */
  slugPaths?: { fr: string; en: string };
  /** Adds a robots noindex,nofollow meta tag — for pages that shouldn't be indexed (404, admin, etc). */
  noIndex?: boolean;
}

export default function SEO({
  title,
  description,
  routeKey,
  image = DEFAULT_IMAGE,
  jsonLd,
  slugPaths,
  noIndex = false,
}: SEOProps) {
  const lang = useCurrentLang();
  const { i18n } = useTranslation();
  const paths = slugPaths ?? (routeKey ? routes[routeKey] : undefined);
  const url = paths ? `${SITE_URL}${paths[lang]}` : undefined;

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {url && <link rel="canonical" href={url} />}

      {paths && (
        <>
          <link rel="alternate" hrefLang="fr" href={`${SITE_URL}${paths.fr}`} />
          <link rel="alternate" hrefLang="en" href={`${SITE_URL}${paths.en}`} />
          <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${paths.fr}`} />
        </>
      )}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
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
