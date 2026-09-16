# Issue #14 — Rule Section content model and Skills relationship

## Decision summary

This recommendation keeps the app aligned to the glossary in `CONTEXT.md` and the resolved navigation decision from issue #13:

- `Rules Reference` is the in-app, searchable collection of BB2025 rules for a ruleset.
- `Rule Section` is the smallest independently addressable and searchable unit of rules content.
- `Rules Snapshot` is the reviewed, versioned local state used to populate one Rules Reference.
- `/rules` is the canonical documentation area.
- `/skills` remains a specialist route that references the rules material without duplicating it.

The canonical model is therefore: a `Rule Section` is a versioned, source-backed content fragment whose identity is stable, searchable, and deep-linkable, and whose parent hierarchy is preserved from source chapters and subsections.

## Design principles confirmed from the parent map and navigation decision

1. Preserve source provenance and hierarchy.
   - The source corpus resolution in issue #12 explicitly says not to flatten the chapter table of contents or use browser-page boundaries as the search unit.
   - Rule Sections should keep source heading, parent path, and anchor metadata.

2. Keep material boundaries semantic, not visual.
   - A table or figure is part of the surrounding Rule Section when it is substantive rule material.
   - A row within a rules table is not its own Rule Section.
   - FAQ and errata entries are amendment records that point at a target rule section, not embedded copies of the original chapter text.

3. Prefer deep-linkable, reviewable content over monolithic pages.
   - The app must be searchable, anchor-first, and offline-capable.
   - The canonical unit must be individually addressable as a route anchor or section ID.

4. Do not duplicate specialist content.
   - `/skills` is for skill catalog lookup and cross-reference context.
   - It should surface links into the relevant Rules Reference material rather than create a second copy of the rules text.

## Canonical Rule Section model

The canonical `Rule Section` is a single data record in the app’s local Rules Snapshot.

### Required metadata

Each Rule Section should include:

- `id`: stable canonical identifier, e.g. `bb2025-core-rules-game-essentials-1`
- `ruleset`: `bb2025`
- `snapshotId`: the Rules Snapshot version that supplied this section
- `source`: document family metadata
  - `family`: `core-rules` | `faq` | `spike`
  - `sourceUrl`
  - `chapterTitle`
  - `chapterSlug`
  - `sourceHeading`
  - `sourceAnchor`
  - `retrievalDate`
  - `contentHash`
- `title`: visible heading for UI display
- `summary`: short explanatory sentence when useful
- `body`: canonical rule text, stored as structured blocks rather than a raw HTML blob
- `contentType`: `text` | `table` | `figure` | `faq-entry` | `amendment`
- `status`: `approved` | `reviewed` | `needs-review`

### Hierarchy and cross-reference fields

Each section should keep its source hierarchy in explicit fields:

- `chapterId`
- `chapterPath`: ordered path of source headings, e.g. `["Game Essentials", "Kickoff", "The start of a drive"]`
- `parentSectionId`: optional parent Rule Section
- `sectionDepth`: numeric depth within source hierarchy
- `sectionOrder`: stable source order within a chapter
- `anchors`: list of local anchors or target ids for direct deep-linking

Cross-reference fields should be explicit and not inferred only from text:

- `relatedRuleSectionIds`: direct rule references
- `amendsRuleSectionIds`: sections changed by FAQ/errata
- `relatedSkillIds`: skill names or canonical skill ids that are relevant to this rule
- `relatedTeamIds`: team-specific rule references where relevant
- `relatedStarPlayerIds`: star-player references when the rules mention them
- `sourceTargetRefs`: print-page or section labels from the original source when present

### Structured material handling

The app should store rule material semantically, not as one giant string:

- Text blocks as structured paragraphs or list items
- Tables as table objects with caption, headers, and rows
- Figures as `{ caption, altText, mediaRef, placement }` objects
- FAQ/errata as amendment objects with `operation` (`add` | `change` | `remove`), `targetRef`, and `notes`

The rule authoring rule is simple: keep each substantive object with the section that owns it. A table row is not a separate Rule Section; a table or figure stays attached to the parent Rule Section.

### Source attribution and versioning

Every Rule Section must carry source attribution and snapshot versioning:

- `sourceUrl`
- `retrievalDate`
- `reviewedBy`
- `reviewedAt`
- `contentHash`
- `snapshotId`
- `sourceRevision`: the document’s visible revision if known, e.g. `May 2026 FAQ`

This allows a local, reviewed `Rules Snapshot` to be updated intentionally without changing the app’s runtime source of truth.

## Boundary between Rules Reference and Skills specialist routes

### What lives in the Rules Reference

The Rules Reference owns all canonical rule language and source-backed explanation, including:

- Core Rules chapters
- FAQ / errata overlay entries
- Spike! 19–22 material
- inherited rule mechanics and terminology
- rule tables and figures that are part of the published rules

### What stays in /skills

The Skills route keeps only specialist skill catalog material:

- skill names and categories
- skill effects and summaries
- skill lookup/search index
- elite and specialty classifications
- star-player skill summaries for the specialist route

It does not duplicate full rule text or re-publish the canonical rule definitions.

### Cross-links between them

The boundary is intentionally directional:

- `/skills` entries should include one or more `relatedRuleSectionIds` or deep links to `/rules` anchors.
- `/rules` entries may optionally include `relatedSkillIds` when a rule directly references a skill or trait.
- Search results in `/rules` may show relevant skill links, but rule content remains in `/rules`.

So the app should treat `/skills` as a derived index over the rules content, not as an alternate content store.

## Recommended concrete schema and routing

### Schema shape

```ts
interface RuleSection {
  id: string;
  ruleset: 'bb2025';
  snapshotId: string;
  family: 'core-rules' | 'faq' | 'spike';
  chapterId: string;
  chapterTitle: string;
  chapterSlug: string;
  title: string;
  slug: string;
  parentSectionId?: string;
  path: string[];
  sectionDepth: number;
  sectionOrder: number;
  contentType: 'text' | 'table' | 'figure' | 'faq-entry' | 'amendment';
  body?: Array<{
    type: 'paragraph' | 'list' | 'table' | 'figure' | 'quote';
    value: unknown;
  }>;
  relatedRuleSectionIds?: string[];
  amendsRuleSectionIds?: string[];
  relatedSkillIds?: string[];
  source: {
    url: string;
    heading: string;
    anchor: string;
    retrievalDate: string;
    contentHash: string;
    sourceRevision?: string;
  };
  review: {
    status: 'approved' | 'reviewed' | 'needs-review';
    reviewedBy?: string;
    reviewedAt?: string;
  };
}
```

### Routing structure

Recommended route map for the app:

- `/rules` — landing page containing chapter browser and search
- `/rules/[chapter]` — chapter overview with collapsed TOC and section list
- `/rules/[chapter]/[section]` — direct Section reader view with deep-linked anchor support
- `/skills` — specialist skill index with links back into `/rules`

The chapter and section route should be based on stable slugs produced from source headings, not on browser-page URLs or random generated ids. The section route should resolve to a Rule Section id and scroll to the selected anchor.

### Snapshot handling for local/offline PWA

The local app should ship a `Rules Snapshot` as reviewed data bundled into the app, not fetched live at runtime.

Recommended behavior:

- Keep an immutable snapshot file under a data directory, e.g. `src/lib/data/rules/snapshots/bb2025-<version>.json`.
- Store the snapshot as a curated JSON export of canonical Rule Sections.
- Track current active snapshot in a small index file that points to the active version.
- Use the local snapshot for search, contents navigation, and offline reading.
- If the app later updates the rules, it does a deliberate snapshot bump and review, not a runtime third-party fetch.

This fits the offline PWA requirement and the repo’s current local-data pattern, which already uses static data bundles in `src/lib/data` rather than live network calls.

## Implementation-ready recommendation

Choose the canonical Rule Section as a reviewable, versioned, source-backed fragment whose identity is stable, hierarchical, and deep-linkable, and whose storage sits in the local Rules Snapshot behind the `/rules` route.

Use this rule for the data model:

- Rule content belongs to `Rules Reference`.
- Specialist skill content belongs to `/skills`.
- Cross-links are explicit references, not duplicated content.
- Tables and figures remain attached to the owning Rule Section.
- FAQ/errata are amendment objects that target source sections.

This is the cleanest fit for the existing Svelte app because it matches the local-data, offline-first architecture already used for static roster and skill content. It preserves the author’s intent from the source corpus, supports deep-links and mobile navigation, and keeps the app’s content boundaries easy to review and version without over-engineering.

## Outcome

This issue should resolve as a design decision, not a feature implementation: the canonical Rule Section model is the data primitive for the BB2025 Rules Reference, and `/skills` remains a specialist index that links back to rules sections rather than storing a duplicate copy of the rule text.
