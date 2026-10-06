import { page } from "vitest/browser";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { get } from "svelte/store";
import Page from "./+page.svelte";
import { getTeams } from "$lib/data/teams";
import { savedTeams, saveTeam } from "$lib/stores/savedTeams";
import { settings } from "$lib/stores/settings";
import { decodeAndValidateTeamShare, encodeTeamShare } from "$lib/tools/teamSharing";

vi.mock("fluentui-icons-svelte/EditRegular.svelte", () => ({ default: () => undefined }));
vi.mock("fluentui-icons-svelte/DeleteRegular.svelte", () => ({ default: () => undefined }));
vi.mock("fluentui-icons-svelte/ShareRegular.svelte", () => ({ default: () => undefined }));

const sourceTeam = Object.values(getTeams("2025"))[0];

function makeSavedTeam() {
  return {
    name: "Shared roster",
    selectedTeamId: sourceTeam.id,
    ruleset: "2025" as const,
    mode: "11s" as const,
    roster: { players: {}, stars: {}, reRolls: 0, apothecary: 0 },
    startingTreasury: 1000000
  };
}

describe("Saved teams sharing", () => {
  beforeEach(() => {
    savedTeams.set([]);
    window.location.hash = "";
    settings.update((current) => ({ ...current, ruleset: "2025", mode: "11s" }));
  });

  it("copies a URL-encoded team link from the saved team card", async () => {
    saveTeam(makeSavedTeam());
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText }
    });

    render(Page);
    const shareButton = page.getByRole("button", { name: "Share Shared roster" });
    await shareButton.click();
    await expect.element(page.getByRole("status")).toHaveTextContent("Copied!");

    expect(writeText).toHaveBeenCalledOnce();
    const copiedUrl = new URL(writeText.mock.calls[0][0] as string);
    expect(copiedUrl.pathname).toBe("/saved-teams");
    expect(copiedUrl.hash.startsWith("#share=")).toBe(true);
    const decoded = decodeAndValidateTeamShare(copiedUrl.hash.slice("#share=".length));
    expect(decoded.ok).toBe(true);
  });

  it("imports a matching shared team once and clears the fragment", async () => {
    const encoded = encodeTeamShare({ id: "sender-local-id", shareId: "incoming-share-id", ...makeSavedTeam() });
    window.location.hash = `share=${encoded}`;

    render(Page);
    await expect.element(page.getByRole("status")).toHaveTextContent("Shared team added");
    expect(get(savedTeams)).toHaveLength(1);
    expect(get(savedTeams)[0]).toMatchObject({
      name: "Shared roster",
      shareId: "incoming-share-id",
      ruleset: "2025",
      roster: makeSavedTeam().roster
    });
    expect(window.location.hash).toBe("");
  });

  it("leaves incompatible links in place and does not alter the saved list", async () => {
    settings.update((current) => ({ ...current, ruleset: "2020" }));
    const encoded = encodeTeamShare({ id: "sender-local-id", shareId: "wrong-ruleset", ...makeSavedTeam() });
    window.location.hash = `share=${encoded}`;

    render(Page);
    await expect.element(page.getByRole("alert")).toHaveTextContent("uses the 2025 ruleset");
    expect(get(savedTeams)).toHaveLength(0);
    expect(window.location.hash).toBe(`#share=${encoded}`);
    expect(get(settings).ruleset).toBe("2020");
  });

  it("shows a manually copyable link when clipboard access fails", async () => {
    saveTeam(makeSavedTeam());
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("permission denied")) }
    });

    render(Page);
    await page.getByRole("button", { name: "Share Shared roster" }).click();
    await expect.element(page.getByRole("alert")).toHaveTextContent("Select and copy");
    const input = page.getByRole("textbox", { name: "Share link" }).element() as HTMLInputElement;
    expect(input.value).toContain("#share=");
  });
});
