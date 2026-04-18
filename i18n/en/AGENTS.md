# AGENTS.md

## Scope

- This file applies to `i18n/en/**`.
- It supplements the repository-root `AGENTS.md`.

## English Localization Rules

- Files under `i18n/en/**` are localized content, not an independent source of truth, unless the task explicitly says otherwise.
- For docs, compare against `docs/**` when a matching source file exists.
- For blog posts, compare against `blog/**` when a matching source file exists.
- For theme and code translations, keep keys and structure unchanged unless the task is specifically about translation infrastructure.

## Review And Editing Priorities

- Preserve meaning, user actions, and information hierarchy from the source content.
- Flag semantic drift, missing sections, broken localized links, broken image references, untranslated Chinese text, or mixed-locale UI labels.
- Keep front matter changes intentional. A translated file should not silently change routing or metadata unless that is the point of the change.
- Natural English is preferred, but do not ask for stylistic rewrites when the translation is already correct and clear.
- If a localized string depends on Docusaurus behavior such as navbar, footer, docs routes, or blog metadata, verify it in that product context instead of reviewing the sentence in isolation.
