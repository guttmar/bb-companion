# Mobile-first roster card layout

## Purpose

Replace the existing roster table with a responsive, card-based player list that is comfortable to use on narrow portrait screens while remaining clear at wider widths. This is a planning artifact: each ticket below is scoped for a later agent handoff; no GitHub issues are created by this plan.

## Decisions confirmed

- Use cards at every viewport width; do not retain a separate desktop table presentation.
- Each card has a two-band information area. The player identity/count region sits to the left and spans both bands where there is room.
- At ultra-narrow widths (target breakpoint around 360px), stack the identity/count region above the two data bands rather than squeezing the side-by-side layout.
- Show player name and all tags without collapsing them.
- Show cost and all five labeled stats (MA, ST, AG, PA, AV) in the top band. Let the pills wrap as needed; do not hide stats or introduce horizontal scrolling.
- Put labeled Prim, Sec, and Skills groups in the lower band.
- Use labeled pills for cost, stats, Prim, and Sec so there is no dependency on table column headings.
- For long Prim, Sec, and Skills groups, show up to three items initially and provide an explicit inline “+N more”/collapse control for the remaining items. Tag lists are not collapsed.
- Keep skill pills interactive and preserve the existing skill-details modal behavior.
- Keep the scope to current roster player rows. Star Players, Other, roster data, and roster business rules are not part of this change.

## Proposed card anatomy

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Player name       │ Cost 50k · MA 6 · ST 3 · AG 3+ · PA — · AV 8+       │
│ [−] 1 / 6 [+]     │ Prim: [G] [AS] · Sec: [—] · Skills: [Block] [+2]    │
│ [Tag] [Long tag]  │                                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

At the narrowest widths, stack the identity/count region above the information bands. Allow the labeled values and chip groups to wrap naturally while preserving their order and labels. Keep card borders, spacing, contrast, and dark-mode behavior consistent with the existing app. Use the Star Players page's labeled stat-pill and skill-tag treatment as the visual reference; player tags should use a similar but more compact, non-interactive pill style.

## Handoff tickets

### Ticket 1 — Replace the roster table with card-oriented markup

**Likely file:** `src/lib/tools/RosterTable.svelte`

Replace table rows and repeated column headings with a semantic list of player cards. Render the existing count controls and player name/tags in the identity region; render cost and labeled MA/ST/AG/PA/AV values in the top information band; render labeled Prim, Sec, and Skills groups in the lower band. Preserve the existing cost/stat formatting, roster-store updates, disabled decrement state, empty-value em dash behavior, and skill-details modal. Do not change the roster data model or selection rules.

**Acceptance criteria**

- There is one semantic list item/card for each player in the selected team's player list, in existing order.
- Cards expose count controls, name, every tag, formatted cost, all five labeled stats, and the labeled Prim/Sec/Skills groups.
- Table column headings are gone; values remain understandable through their own labels.
- Plus/minus controls still update the same roster counts, and decrement remains disabled at zero.
- Activating a skill still opens its detail modal; closing the modal still works.
- No changes are made to Star Players, Other, saved-roster shape, or roster calculations.

### Ticket 2 — Style cards for mobile-first responsive use

**Likely file:** `src/lib/tools/RosterTable.svelte`

Implement the card surface and two-band layout at all widths. Keep the identity/count area alongside the bands when space permits and spanning both bands; around the ultra-narrow breakpoint (approximately 360px), stack identity above them. Use wrapping labeled stat/access pills and compact player-tag pills. Retain readable light/dark themes and provide comfortably tappable count controls.

**Acceptance criteria**

- The player list remains cards on phones, tablets, and desktop; no viewport switches back to a table.
- At approximately 360px and above, identity/count occupies the left rail and spans the two right-side bands.
- Below the narrow breakpoint, identity/count stacks above the bands; no content is clipped or requires horizontal scrolling.
- Cost and all five stat pills remain visible at 320px portrait width, wrapping when required.
- Prim, Sec, and Skills remain in the lower band; labels stay visible when groups wrap.
- Tags look like compact pills consistent with the Star Players skill-tag style but are not presented as buttons.
- Cards, pills, text, borders, and controls remain legible in both light and dark mode.
- Count controls have accessible names that identify the player and action, and touch targets are usable on phones.

### Ticket 3 — Add inline expansion for long access and skill groups

**Likely file:** `src/lib/tools/RosterTable.svelte`

Initially show at most three items in each Prim, Sec, and Skills group. When additional items exist, provide a per-card, per-group control that reveals the remainder inline and can collapse it again. Keep skills themselves as buttons that open the existing detail modal; expansion controls must be distinct from skill buttons.

**Acceptance criteria**

- Groups with three or fewer items show all items and no expansion control.
- Longer groups initially show three items and a control with the correct remaining count.
- Expanding reveals every remaining item; collapsing restores the compact view.
- Each group's expand/collapse state is independent, and one card's interaction does not expand other cards.
- Expansion controls expose their state accessibly (for example, with `aria-expanded`) and work by keyboard.
- Expanding/collapsing a Skills group does not trigger the skill modal; activating a skill continues to open it.
- Every player tag remains visible regardless of group expansion.

### Ticket 4 — Update regression coverage and verify viewport behavior

**Likely file:** `src/routes/roster/roster.spec.ts`; add a focused component test if that gives better isolation.

Replace assertions that expect roster table headings with assertions for the new labeled card content. Add coverage for card rendering, tags, formatted stats and cost, count controls, skill modal interaction, and access/skill expansion. Verify the responsive treatment in a real browser at narrow portrait and wider widths, including long names/tags/groups and both themes.

**Acceptance criteria**

- Tests assert labels and values within roster cards instead of expecting standalone MA/ST/AG/PA/AV/Prim/Sec table headings.
- Tests cover initial/collapsed/expanded group states, accessible expansion state, count updates, and skill modal interaction.
- Browser review includes 320px, approximately 360px, 390px, tablet, and desktop widths; cards have no horizontal overflow and content remains readable.
- Existing save/update, team sorting, and other roster-page behavior tests continue to pass.
- `pnpm check`, `pnpm test`, `pnpm lint`, and `pnpm build` pass.

## Suggested execution order

1. Ticket 1 establishes the card markup and preserves behavior.
2. Ticket 2 adds responsive visual treatment; it can proceed with Ticket 1's markup contract.
3. Ticket 3 adds long-list disclosure to the card groups.
4. Ticket 4 updates regression coverage alongside the implementation and performs final viewport/build verification.

Tickets 2 and 3 can be handed to separate agents after Ticket 1 settles the markup and class/slot contract. Ticket 4 should be coordinated with the implementation to avoid test assumptions diverging from the final markup.

## Out of scope

- Redesigning the Star Players or Other tables.
- Changing player/team data, roster limits, cost/stat calculations, or saved-team persistence.
- Adding horizontal scrolling, hiding core stats, or retaining a separate desktop-only table.
- Changing the existing skill details content or modal behavior.
