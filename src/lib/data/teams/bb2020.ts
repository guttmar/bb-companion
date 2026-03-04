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
        max: 16,
        skills: []
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
        max: 4,
        skills: ["Catch", "Nerves of Steel"]
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
        max: 2,
        skills: ["Pass"]
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
        max: 4,
        skills: ["Block"]
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
        max: 1,
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow (+1)", "Thick Skull", "Throw Team-mate"]
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
        max: 16,
        skills: []
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
        max: 4,
        skills: ["Dodge", "Right Stuff", "Stunty"]
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
        max: 2,
        skills: ["Pass"]
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
        max: 4,
        skills: ["Block"]
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
        max: 4,
        skills: ["Brawler", "Grab"]
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
        max: 1,
        skills: ["Always Hungry", "Loner (4+)", "Mighty Blow (+1)", "Projectile Vomit", "Really Stupid", "Regeneration", "Throw Team-mate"]
      }
    ]
  },

  amazon: {
    id: "amazon",
    name: "Amazon",
    tier: 1,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "eagle-warrior-linewoman",
        name: "Eagle Warrior Linewoman",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 50000,
        max: 16,
        skills: ["Dodge"]
      },
      {
        id: "python-warrior-thrower",
        name: "Python Warrior Thrower",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 3,
        av: 8,
        cost: 80000,
        max: 2,
        skills: ["Dodge", "On the Ball", "Pass", "Safe Pass"]
      },
      {
        id: "piranha-warrior-blitzer",
        name: "Piranha Warrior Blitzer",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 5,
        av: 8,
        cost: 90000,
        max: 2,
        skills: ["Dodge", "Hit and Run", "Jump Up"]
      },
      {
        id: "jaguar-warrior-blocker",
        name: "Jaguar Warrior Blocker",
        ma: 6,
        st: 4,
        ag: 3,
        pa: 5,
        av: 9,
        cost: 110000,
        max: 2,
        skills: ["Defensive", "Dodge"]
      }
    ]
  },

  lizardmen: {
    id: "lizardmen",
    name: "Lizardmen",
    tier: 1,
    rerollCost: 70000,
    apothecary: true,
    players: [
      {
        id: "skink-lineman",
        name: "Skink Lineman",
        ma: 8,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 60000,
        max: 16
      },
      {
        id: "chameleon-skink",
        name: "Chameleon Skink",
        ma: 7,
        st: 2,
        ag: 3,
        pa: 3,
        av: 8,
        cost: 70000,
        max: 2
      },
      {
        id: "saurus-blocker",
        name: "Saurus Blocker",
        ma: 6,
        st: 4,
        ag: 5,
        pa: 6,
        av: 10,
        cost: 85000,
        max: 6
      },
      {
        id: "kroxigor",
        name: "Kroxigor",
        ma: 6,
        st: 5,
        ag: 5,
        av: 10,
        cost: 140000,
        max: 1
      }
    ]
  },

  imperialNobility: {
    id: "imperial-nobility",
    name: "Imperial Nobility",
    tier: 2,
    rerollCost: 70000,
    apothecary: true,
    players: [
      {
        id: "imperial-retainer",
        name: "Imperial Retainer Lineman",
        ma: 6,
        st: 3,
        ag: 4,
        pa: 4,
        av: 8,
        cost: 45000,
        max: 12,
        skills: ["Fend"]
      },
      {
        id: "imperial-thrower",
        name: "Imperial Thrower",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 3,
        av: 9,
        cost: 75000,
        max: 2,
        skills: ["Pass", "Running Pass"]
      },
      {
        id: "bodyguard",
        name: "Bodyguard",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 5,
        av: 9,
        cost: 90000,
        max: 4,
        skills: ["Wrestle", "Stand Firm"]
      },
      {
        id: "noble-blitzer",
        name: "Noble Blitzer",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 105000,
        max: 2,
        skills: ["Block", "Catch"]
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
        max: 1,
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow (+1)", "Thick Skull", "Throw Team-mate"]
      }
    ]
  },

  blackOrc: {
    id: "black-orc",
    name: "Black Orc",
    tier: 2,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "goblin-bruiser-lineman",
        name: "Goblin Bruiser Lineman",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 45000,
        max: 12,
        skills: ["Dodge", "Right Stuff", "Stunty", "Thick Skull"]
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
        max: 6,
        skills: ["Brawler", "Grab"]
      },
      {
        id: "trained-troll",
        name: "Trained Troll",
        ma: 4,
        st: 5,
        ag: 5,
        pa: 5,
        av: 10,
        cost: 115000,
        max: 1,
        skills: ["Always Hungry", "Loner (3+)", "Mighty Blow (+1)", "Projectile Vomit", "Really Stupid", "Regeneration", "Throw Team-mate"]
      }
    ]
  },

  chaosChosen: {
    id: "chaos-chosen",
    name: "Chaos Chosen",
    tier: 2,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "beastman-runner-lineman",
        name: "Beastman Runner Lineman",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 60000,
        max: 16,
        skills: ["Horns"]
      },
      {
        id: "chosen-blocker",
        name: "Chosen Blocker",
        ma: 5,
        st: 4,
        ag: 3,
        pa: 5,
        av: 10,
        cost: 100000,
        max: 4,
        skills: []
      },
      {
        id: "chaos-troll",
        name: "Chaos Troll",
        ma: 4,
        st: 5,
        ag: 5,
        pa: 5,
        av: 10,
        cost: 115000,
        max: 1,
        skills: ["Always Hungry", "Loner (4+)", "Mighty Blow (+1)", "Projectile Vomit", "Really Stupid", "Regeneration", "Throw Team-mate"]
      },
      {
        id: "chaos-ogre",
        name: "Chaos Ogre",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 5,
        av: 10,
        cost: 140000,
        max: 1,
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow (+1)", "Thick Skull", "Throw Team-mate"]
      },
      {
        id: "minotaur",
        name: "Minotaur",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 0,
        av: 9,
        cost: 150000,
        max: 1,
        skills: ["Frenzy", "Horns", "Loner (4+)", "Mighty Blow (+1)", "Thick Skull", "Unchannelled Fury"]
      }
    ]
  },

  chaosDwarf: {
    id: "chaos-dwarf",
    name: "Chaos Dwarf",
    tier: 1,
    rerollCost: 70000,
    apothecary: true,
    players: [
      {
        id: "hobgoblin-lineman",
        name: "Hobgoblin Lineman",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 40000,
        max: 16,
        skills: []
      },
      {
        id: "hobgoblin-sneaky-stabba",
        name: "Hobgoblin Sneaky Stabba",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 5,
        av: 8,
        cost: 70000,
        max: 2,
        skills: ["Shadowing", "Stab"]
      },
      {
        id: "chaos-dwarf-blocker",
        name: "Chaos Dwarf Blocker",
        ma: 4,
        st: 3,
        ag: 4,
        pa: 6,
        av: 10,
        cost: 70000,
        max: 4,
        skills: ["Block", "Iron Hard Skin", "Thick Skull"]
      },
      {
        id: "chaos-dwarf-flamesmith",
        name: "Chaos Dwarf Flamesmith",
        ma: 5,
        st: 3,
        ag: 4,
        pa: 6,
        av: 10,
        cost: 80000,
        max: 2,
        skills: ["Brawler", "Breathe Fire", "Disturbing Presence", "Thick Skull"]
      },
      {
        id: "bull-centaur-blitzer",
        name: "Bull Centaur Blitzer",
        ma: 6,
        st: 4,
        ag: 4,
        pa: 6,
        av: 10,
        cost: 130000,
        max: 2,
        skills: ["Sprint", "Sure Feet", "Thick Skull"]
      },
      {
        id: "minotaur",
        name: "Minotaur",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 0,
        av: 9,
        cost: 150000,
        max: 1,
        skills: ["Frenzy", "Horns", "Loner (4+)", "Mighty Blow (+1)", "Thick Skull", "Unchannelled Fury"]
      }
    ]
  },

  darkElf: {
    id: "dark-elf",
    name: "Dark Elf",
    tier: 1,
    rerollCost: 50000,
    apothecary: true,
    players: [
      {
        id: "dark-elf-lineman",
        name: "Dark Elf Lineman",
        ma: 6,
        st: 3,
        ag: 2,
        pa: 4,
        av: 9,
        cost: 70000,
        max: 12,
        skills: []
      },
      {
        id: "runner",
        name: "Runner",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 3,
        av: 8,
        cost: 80000,
        max: 2,
        skills: ["Dump-Off"]
      },
      {
        id: "blitzer",
        name: "Blitzer",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 4,
        av: 9,
        cost: 100000,
        max: 4,
        skills: ["Block"]
      },
      {
        id: "assassin",
        name: "Assassin",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 5,
        av: 8,
        cost: 85000,
        max: 2,
        skills: ["Shadowing", "Stab"]
      },
      {
        id: "witch-elf",
        name: "Witch Elf",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 5,
        av: 8,
        cost: 110000,
        max: 2,
        skills: ["Dodge", "Frenzy", "Jump Up"]
      }
    ]
  },

  dwarf: {
    id: "dwarf",
    name: "Dwarf",
    tier: 1,
    rerollCost: 50000,
    apothecary: true,
    players: [
      {
        id: "dwarf-blocker-lineman",
        name: "Dwarf Blocker Lineman",
        ma: 4,
        st: 3,
        ag: 4,
        pa: 5,
        av: 10,
        cost: 70000,
        max: 12,
        skills: ["Block", "Tackle", "Thick Skull"]
      },
      {
        id: "runner",
        name: "Runner",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 85000,
        max: 2,
        skills: ["Sure Hands", "Thick Skull"]
      },
      {
        id: "blitzer",
        name: "Blitzer",
        ma: 5,
        st: 3,
        ag: 3,
        pa: 4,
        av: 10,
        cost: 80000,
        max: 2,
        skills: ["Block", "Thick Skull"]
      },
      {
        id: "troll-slayer",
        name: "Troll Slayer",
        ma: 5,
        st: 3,
        ag: 4,
        pa: 0,
        av: 9,
        cost: 95000,
        max: 2,
        skills: ["Block", "Dauntless", "Frenzy", "Thick Skull"]
      },
      {
        id: "deathroller",
        name: "Deathroller",
        ma: 4,
        st: 7,
        ag: 5,
        pa: 0,
        av: 11,
        cost: 170000,
        max: 1,
        skills: ["Break Tackle", "Dirty Player (+2)", "Juggernaut", "Loner (5+)", "Mighty Blow (+1)", "No Hands", "Secret Weapon", "Stand Firm"]
      }
    ]
  },

  elvenUnion: {
    id: "elven-union",
    name: "Elven Union",
    tier: 2,
    rerollCost: 50000,
    apothecary: true,
    players: [
      {
        id: "lineman",
        name: "Lineman",
        ma: 6,
        st: 3,
        ag: 2,
        pa: 4,
        av: 8,
        cost: 60000,
        max: 12,
        skills: []
      },
      {
        id: "thrower",
        name: "Thrower",
        ma: 6,
        st: 3,
        ag: 2,
        pa: 2,
        av: 8,
        cost: 75000,
        max: 2,
        skills: ["Pass"]
      },
      {
        id: "catcher",
        name: "Catcher",
        ma: 8,
        st: 3,
        ag: 2,
        pa: 4,
        av: 8,
        cost: 100000,
        max: 4,
        skills: ["Catch", "Nerves of Steel"]
      },
      {
        id: "blitzer",
        name: "Blitzer",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 3,
        av: 9,
        cost: 115000,
        max: 2,
        skills: ["Block", "Sidestep"]
      }
    ]
  },

  gnome: {
    id: "gnome",
    name: "Gnome",
    tier: 3,
    rerollCost: 50000,
    apothecary: true,
    players: [
      {
        id: "gnome-lineman",
        name: "Gnome Lineman",
        ma: 5,
        st: 2,
        ag: 3,
        pa: 4,
        av: 7,
        cost: 40000,
        max: 16,
        skills: ["Jump Up", "Right Stuff", "Stunty", "Wrestle"]
      },
      {
        id: "gnome-beastmaster",
        name: "Gnome Beastmaster",
        ma: 5,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 55000,
        max: 2,
        skills: ["Guard", "Jump Up", "Stunty", "Wrestle"]
      },
      {
        id: "gnome-illusionist",
        name: "Gnome Illusionist",
        ma: 5,
        st: 2,
        ag: 3,
        pa: 3,
        av: 7,
        cost: 50000,
        max: 2,
        skills: ["Jump Up", "Stunty", "Trickster", "Wrestle"]
      },
      {
        id: "woodland-fox",
        name: "Woodland Fox",
        ma: 7,
        st: 2,
        ag: 2,
        pa: 0,
        av: 6,
        cost: 50000,
        max: 2,
        skills: ["Dodge", "My Ball", "Sidestep", "Stunty"]
      },
      {
        id: "altern-forest-treeman",
        name: "Altern Forest Treeman",
        ma: 2,
        st: 6,
        ag: 5,
        pa: 5,
        av: 11,
        cost: 120000,
        max: 2,
        skills: ["Mighty Blow (+1)", "Stand Firm", "Strong Arm", "Take Root", "Thick Skull", "Throw Team-mate", "Timmm-ber!"]
      }
    ]
  },

  goblin: {
    id: "goblin",
    name: "Goblin",
    tier: 3,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "goblin-lineman",
        name: "Goblin Lineman",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 40000,
        max: 16,
        skills: ["Dodge", "Right Stuff", "Stunty"]
      },
      {
        id: "bomma",
        name: "Bomma",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 45000,
        max: 1,
        skills: ["Bombardier", "Dodge", "Secret Weapon", "Stunty"]
      },
      {
        id: "looney",
        name: "Looney",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 0,
        av: 8,
        cost: 40000,
        max: 1,
        skills: ["Chainsaw", "Secret Weapon", "Stunty"]
      },
      {
        id: "fanatic",
        name: "Fanatic",
        ma: 3,
        st: 7,
        ag: 3,
        pa: 0,
        av: 8,
        cost: 70000,
        max: 1,
        skills: ["Ball and Chain", "No Hands", "Secret Weapon", "Stunty"]
      },
      {
        id: "pogoer",
        name: "Pogoer",
        ma: 7,
        st: 2,
        ag: 3,
        pa: 5,
        av: 8,
        cost: 75000,
        max: 1,
        skills: ["Dodge", "Pogo Stick", "Stunty"]
      },
      {
        id: "ooligan",
        name: "'Ooligan",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 6,
        av: 8,
        cost: 65000,
        max: 1,
        skills: ["Dirty Player (+1)", "Disturbing Presence", "Dodge", "Right Stuff", "Stunty"]
      },
      {
        id: "doom-diver",
        name: "Doom Diver",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 6,
        av: 8,
        cost: 60000,
        max: 1,
        skills: ["Right Stuff", "Stunty", "Swoop"]
      },
      {
        id: "trained-troll",
        name: "Trained Troll",
        ma: 4,
        st: 5,
        ag: 5,
        pa: 5,
        av: 10,
        cost: 115000,
        max: 2,
        skills: ["Always Hungry", "Loner (3+)", "Mighty Blow (+1)", "Projectile Vomit", "Really Stupid", "Regeneration", "Throw Team-mate"]
      }
    ]
  },

  halfling: {
    id: "halfling",
    name: "Halfling",
    tier: 3,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "halfling-hopeful-lineman",
        name: "Halfling Hopeful Lineman",
        ma: 5,
        st: 2,
        ag: 3,
        pa: 4,
        av: 7,
        cost: 30000,
        max: 16,
        skills: ["Dodge", "Right Stuff", "Stunty"]
      },
      {
        id: "halfling-hefty",
        name: "Halfling Hefty",
        ma: 5,
        st: 2,
        ag: 3,
        pa: 3,
        av: 8,
        cost: 50000,
        max: 2,
        skills: ["Dodge", "Fend", "Stunty"]
      },
      {
        id: "halfling-catcher",
        name: "Halfling Catcher",
        ma: 5,
        st: 2,
        ag: 3,
        pa: 5,
        av: 7,
        cost: 55000,
        max: 2,
        skills: ["Catch", "Dodge", "Right Stuff", "Sprint", "Stunty"]
      },
      {
        id: "altern-forest-treeman",
        name: "Altern Forest Treeman",
        ma: 2,
        st: 6,
        ag: 5,
        pa: 5,
        av: 11,
        cost: 120000,
        max: 2,
        skills: ["Mighty Blow (+1)", "Stand Firm", "Strong Arm", "Take Root", "Thick Skull", "Throw Team-mate", "Timmm-ber!"]
      }
    ]
  }
};
