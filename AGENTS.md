# AGENTS.md

## Scope

- This file defines repository-wide defaults.
- A nearer `AGENTS.md` or `AGENTS.override.md` takes precedence.
- Add subdirectory instruction files only when that subtree truly needs different rules; avoid duplicated copies that can drift.
- `i18n/en/AGENTS.md` provides extra rules for English localized content.

## Repository Facts

- This repository is a bilingual Docusaurus v3 site, not a docs-only repo.
- Default-locale source content mainly lives in `docs/`, `blog/`, and `src/pages/**`.
- English localized content mainly lives in:
  - `i18n/en/docusaurus-plugin-content-docs/current/`
  - `i18n/en/docusaurus-plugin-content-blog/`
  - `i18n/en/docusaurus-theme-classic/`
  - `i18n/en/code.json`
- Site config is `docusaurus.config.ts`.
- Docs sidebar is `sidebars.ts`.
- The blog uses a custom plugin at `src/plugin/plugin-content-blog/`.
- There is currently no `versioned_docs/` or `versioned_sidebars/`; do not assume versioning exists unless those directories are later added.
- Common validation commands:
  - `pnpm lint`
  - `pnpm build`
  - `pnpm start --locale en` when English locale behavior needs manual checking

## Review Defaults

- For review requests, default to review mode: prioritize issues that mislead readers, break links/routes/navigation/i18n/build behavior, or introduce factual mistakes.
- Start from the diff when possible; avoid generalized comments on untouched areas.
- Keep findings concrete: file, line, problem, and user impact.
- Style preference alone is not a finding.
- If no issues are found, say so explicitly and note any unverified areas.

## Severity

- `P1`: breaks links, slugs, anchors, front matter, navigation, locale routing, builds, or instructs users to do the wrong thing.
- `P2`: does not immediately break the site but causes semantic drift, translation mismatch, terminology inconsistency, missing localized content, or confusing structure.
- `P3`: typo, wording issue, or small ambiguity that does not change meaning.

## Content And Localization Accuracy

- Do not casually rewrite commands, code blocks, paths, config keys, UI labels, front matter fields, or example values.
- Default-locale Chinese files are usually the source of truth. Treat `i18n/en/**` as localized content unless the diff clearly indicates otherwise.
- When reviewing `i18n/en/**`, compare with the Chinese source file when available and flag semantic drift, missing sections, broken localized links or images, or untranslated mixed-language text.
- Do not require line-by-line literal translation. Equivalent meaning and correct user action matter more than wording symmetry.
- Keep front matter parity intentional: if a localized file changes `slug`, `title`, `description`, `tags`, or other routing and metadata fields, verify the change is deliberate and still valid for that locale.
- For headings that are linked across docs, prefer explicit heading IDs or verify that translated anchors still resolve.

## Docusaurus Checks

- When changes touch `docusaurus.config.ts`, `sidebars.ts`, `src/pages/**`, docs or blog front matter, or `i18n/en/**`, check route generation, navbar or footer labels, edit links, and asset paths together.
- `onBrokenLinks` is set to `warn` in `docusaurus.config.ts`. A successful build is not proof that links are correct; review link targets explicitly.
- If you fix routes, links, slugs, heading IDs, or localized content structure, prefer running `pnpm build`.
- If you change TypeScript, React, or config code, prefer running `pnpm lint` and `pnpm build` when practical.
