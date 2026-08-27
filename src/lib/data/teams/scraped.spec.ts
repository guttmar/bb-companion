import { describe, expect, it } from "vitest";
import { adaptScrapedTeams } from "./scraped";

describe("adaptScrapedTeams", () => {
  it("filters empty entries, derives stable IDs, and preserves scraped metadata", () => {
    const teams = adaptScrapedTeams({
      teams: [
        { name: "Teams", players: [] },
        {
          name: "Chaos Chosen",
          league: "Chaos Clash",
          special_rules: ["Favoured of..."],
          staff: { cheerleader: 10000 },
          star_players: [{ name: "Star", cost: 100000 }],
          inducements: [{ name: "Item", cost: 20000 }],
          players: [
            {
              max_quantity: 16,
              position: "Beastman Runner Lineman",
              MA: "6",
              ST: "3",
              AG: "3+",
              PA: "4+",
              AV: "9+",
              skills: ["Horns"],
              primary: ["G", "M", "S"],
              secondary: ["A", "P"],
              cost: 60000
            }
          ]
        }
      ]
    });

    expect(Object.keys(teams)).toEqual(["chaos-chosen"]);
    expect(teams["chaos-chosen"].players[0]).toMatchObject({
      id: "beastman-runner-lineman",
      ma: 6,
      ag: 3,
      pa: 4,
      av: 9,
      displayStats: { ag: "3+", pa: "4+", av: "9+" }
    });
    expect(teams["chaos-chosen"].league).toBe("Chaos Clash");
  });

  it("keeps the first team when scraped navigation contains duplicates", () => {
    const teams = adaptScrapedTeams({
      teams: [
        { name: "Human", players: [] },
        {
          name: "Human",
          players: [
            {
              max_quantity: 16,
              position: "Lineman",
              MA: "6",
              ST: "3",
              AG: "3+",
              PA: "4+",
              AV: "9+",
              cost: 50000
            }
          ]
        },
        {
          name: "Human",
          players: [
            {
              max_quantity: 16,
              position: "Other Lineman",
              MA: "6",
              ST: "3",
              AG: "3+",
              PA: "4+",
              AV: "9+",
              cost: 50000
            }
          ]
        }
      ]
    });

    expect(Object.keys(teams)).toEqual(["human"]);
    expect(teams.human.players[0].name).toBe("Lineman");
  });
});