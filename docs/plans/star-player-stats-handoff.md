# Star Player Stats Handoff

## Current state

The roster UI supports selecting one copy of each available star player. Star-player data currently contains only `name` and `cost`, so the roster section intentionally renders no stats or skills.

## Resume point

To add stats and skills later:

1. Extend the `Team.starPlayers` type in `src/lib/data/teams/types.ts` with a reusable star-player shape. Include the same stat fields used by `PlayerType`, plus `skills` and any display-only stat strings needed by the rulesets.
2. Update the scraped input shape and adapter in `src/lib/data/teams/scraped.ts` to preserve the fields from the scraper output rather than reducing stars to `{ name, cost }`.
3. Update `scraper/scraper.py` and the generated JSON data if the source pages expose the additional star-player fields there.
4. Replace the compact star-player table in `src/routes/roster/+page.svelte` with a dedicated component or shared table presentation that renders stats and skill buttons consistently with `RosterTable.svelte`.
5. Add scraper, adapter, and browser tests for stats, skills, and the existing one-star-per-player selection behavior.

## Important boundary

Do not add star-player stats to `currentRoster` or saved roster state just to display them. The roster state only needs the selected star names and counts; stats belong to the team catalog data.
