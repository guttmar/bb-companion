import type { TeamMap } from "./types";

export const bb2020Teams: TeamMap = {
  human: {
    id: "human",
    name: "Human",
    tier: 1,
    rerollCost: 50000,
    apothecary: true,
    players: [
      {
        id: "lineman",
        name: "Lineman",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 50000,
        max: 16
      },
      {
        id: "catcher",
        name: "Catcher",
        ma: 8,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 65000,
        max: 4
      },
      {
        id: "thrower",
        name: "Thrower",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 2,
        av: 9,
        cost: 75000,
        max: 2
      },
      {
        id: "blitzer",
        name: "Blitzer",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 10,
        cost: 85000,
        max: 4
      },
      {
        id: "ogre",
        name: "Ogre",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 5,
        av: 10,
        cost: 140000,
        max: 1
      }
    ]
  },

  orc: {
    id: "orc",
    name: "Orc",
    tier: 1,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "lineman",
        name: "Lineman",
        ma: 5,
        st: 3,
        ag: 4,
        pa: 4,
        av: 10,
        cost: 50000,
        max: 16
      },
      {
        id: "goblin",
        name: "Goblin",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 40000,
        max: 4
      },
      {
        id: "thrower",
        name: "Thrower",
        ma: 5,
        st: 3,
        ag: 3,
        pa: 3,
        av: 9,
        cost: 65000,
        max: 2
      },
      {
        id: "blitzer",
        name: "Blitzer",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 10,
        cost: 80000,
        max: 4
      },
      {
        id: "black-orc",
        name: "Black Orc",
        ma: 4,
        st: 4,
        ag: 4,
        pa: 5,
        av: 10,
        cost: 90000,
        max: 4
      },
      {
        id: "troll",
        name: "Troll",
        ma: 4,
        st: 5,
        ag: 5,
        pa: 5,
        av: 11,
        cost: 115000,
        max: 1
      }
    ]
  }
};
