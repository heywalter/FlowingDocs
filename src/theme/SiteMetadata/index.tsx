/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { PageMetadata, useThemeConfig } from '@docusaurus/theme-common';
import {
  DEFAULT_SEARCH_TAG,
  useAlternatePageUtils,
  keyboardFocusedClassName,
} from '@docusaurus/theme-common/internal';
import { useLocation } from '@docusaurus/router';
import { applyTrailingSlash } from '@docusaurus/utils-common';
import SearchMetadata from '@theme/SearchMetadata';
import readingMetadata from '@site/src/data/reading-metadata.json';

// TODO move to SiteMetadataDefaults or theme-common ?
// Useful for i18n/SEO
// See https://developers.google.com/search/docs/advanced/crawling/localized-versions
// See https://github.com/facebook/docusaurus/issues/3317
function AlternateLangHeaders(): ReactNode {
  const {
    i18n: { currentLocale, defaultLocale, localeConfigs },
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();

  const currentHtmlLang = localeConfigs[currentLocale]!.htmlLang;
  const { pathname } = useLocation();
  let decodedPath = pathname;
  try {
    decodedPath = decodeURI(pathname);
  }
  catch { /* Malformed paths have no tag translation. */ }
  const isNotFoundPage = /\/404(?:\.html)?\/?$/.test(pathname);
  const isTagPage = /^\/(?:en\/)?blog\/tags\/[^/]+\//.test(decodedPath);
  const tagAlternates = readingMetadata.tagAlternates as Record<string, Record<string, string>>;
  const tagPair = tagAlternates[decodedPath];
  const alternateLocales = Object.entries(localeConfigs).filter(([locale]) => !isNotFoundPage && (!isTagPage || Boolean(tagPair?.[locale])));
  const localeUrl = (locale: string) => isTagPage
    ? localeConfigs[locale]!.url + tagPair![locale]
    : alternatePageUtils.createUrl({ locale, fullyQualified: true });

  // HTML lang is a BCP 47 tag, but the Open Graph protocol requires
  // using underscores instead of dashes.
  // See https://ogp.me/#optional
  // See https://en.wikipedia.org/wiki/IETF_language_tag)
  const bcp47ToOpenGraphLocale = (code: string): string =>
    code.replace('-', '_');

  // Note: it is fine to use both "x-default" and "en" to target the same url
  // See https://www.searchviu.com/en/multiple-hreflang-tags-one-url/
  return (
    <Head>
      {alternateLocales.map(([locale, { htmlLang }]) => (
        <link
          key={locale}
          rel="alternate"
          href={localeUrl(locale)}
          hrefLang={htmlLang}
        />
      ))}
      {alternateLocales.some(([locale]) => locale === defaultLocale) && (
        <link
          rel="alternate"
          href={localeUrl(defaultLocale)}
          hrefLang="x-default"
        />
      )}

      <meta
        property="og:locale"
        content={bcp47ToOpenGraphLocale(currentHtmlLang)}
      />
      {alternateLocales.map(([, config]) => config)
        .filter(config => currentHtmlLang !== config.htmlLang)
        .map(config => (
          <meta
            key={`meta-og-${config.htmlLang}`}
            property="og:locale:alternate"
            content={bcp47ToOpenGraphLocale(config.htmlLang)}
          />
        ))}
    </Head>
  );
}

// Default canonical url inferred from current page location pathname
function useDefaultCanonicalUrl() {
  const {
    siteConfig: { url: siteUrl, baseUrl, trailingSlash },
  } = useDocusaurusContext();

  // TODO using useLocation().pathname is not a super idea
  // See https://github.com/facebook/docusaurus/issues/9170
  const { pathname } = useLocation();

  const canonicalPathname = applyTrailingSlash(useBaseUrl(pathname), {
    trailingSlash,
    baseUrl,
  });

  return siteUrl + canonicalPathname.replace(/(\.html)\/$/, '$1');
}

// TODO move to SiteMetadataDefaults or theme-common ?
function CanonicalUrlHeaders({ permalink }: { permalink?: string }) {
  const {
    siteConfig: { url: siteUrl },
  } = useDocusaurusContext();
  const defaultCanonicalUrl = useDefaultCanonicalUrl();

  const canonicalUrl = permalink
    ? `${siteUrl}${permalink}`
    : defaultCanonicalUrl;
  return (
    <Head>
      <meta property="og:url" content={canonicalUrl} />
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}

export default function SiteMetadata(): ReactNode {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();

  const { pathname } = useLocation();
  const markdownPaths = readingMetadata.markdownPaths as Record<string, string>;
  const markdownPath = markdownPaths[pathname];
  // TODO maybe move these 2 themeConfig to siteConfig?
  // These seems useful for other themes as well
  const { metadata, image: defaultImage } = useThemeConfig();

  return (
    <>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="describedby" href="https://flowingdocs.com/llms.txt" type="text/plain" />
        {markdownPath && <link rel="alternate" type="text/markdown" href={`https://flowingdocs.com${markdownPath}`} />}
        {/* The keyboard focus class name need to be applied when SSR so links
        are outlined when JS is disabled */}
        <body className={keyboardFocusedClassName} />
      </Head>

      {defaultImage && <PageMetadata image={defaultImage} />}

      <CanonicalUrlHeaders />

      <AlternateLangHeaders />

      <SearchMetadata tag={DEFAULT_SEARCH_TAG} locale={currentLocale} />

      {/*
        It's important to have an additional <Head> element here, as it allows
        react-helmet to override default metadata values set in previous <Head>
        like "twitter:card". In same Head, the same meta would appear twice
        instead of overriding.
      */}
      <Head>
        {/* Yes, "metadatum" is the grammatically correct term */}
        {metadata.map((metadatum, i) => (
          <meta key={i} {...metadatum} />
        ))}
      </Head>
    </>
  );
}
