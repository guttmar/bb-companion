import type { TeamMap } from "./types";

// 2025 teams used to spread the 2020 definitions so that only changed
// entries had to be re‑defined.  that shortcut means any team or value
// not listed below still comes from the 2020 file, which is why you
// would see old stats on the roster page even with the 2025 ruleset
// selected.  drop the spread and explicitly provide the 2025 data so
// there is no accidental bleed through.
export const bb2025Teams: TeamMap = {
  // begin with an empty object; add every team that exists under the
  // 2025 ruleset (override the ones that have changed, or include them
  // verbatim if they are identical).  teams omitted here will not be
  // available when 2025 is active.
  amazon: {
    id: "amazon",
    name: "Amazon",
    tier: 1,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "eagle-warrior",
        name: "Eagle Warrior",
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
        id: "python-warrior",
        name: "Python Warrior",
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
        id: "piranha-warrior",
        name: "Piranha Warrior",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 90000,
        max: 2,
        skills: ["Dodge", "Hit and Run", "Jump Up"]
      },
      {
        id: "jaguar-warrior",
        name: "Jaguar Warrior",
        ma: 6,
        st: 4,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 110000,
        max: 2,
        skills: ["Defensive", "Dodge"]
      }
    ]
  },

  human: {
    id: "human",
    name: "Human",
    tier: 2,
    rerollCost: 50000,
    apothecary: true,
    players: [
      {
        id: "lineman",
        name: "Human Lineman",
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
        id: "halfling-hopeful",
        name: "Halfling Hopeful",
        ma: 5,
        st: 2,
        ag: 3,
        pa: 4,
        av: 7,
        cost: 30000,
        max: 3,
        skills: ["Dodge", "Right Stuff", "Stunty"]
      },
      {
        id: "thrower",
        name: "Human Thrower",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 3,
        av: 9,
        cost: 75000,
        max: 2,
        skills: ["Pass", "Sure Hands"]
      },
      {
        id: "catcher",
        name: "Human Catcher",
        ma: 8,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 75000,
        max: 2,
        skills: ["Catch", "Dodge"]
      },
      {
        id: "blitzer",
        name: "Human Blitzer",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 85000,
        max: 2,
        skills: ["Block", "Tackle"]
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
        skills: ["Bone Head", "Loner (3+)", "Mighty Blow", "Thick Skull", "Throw Team Mate"]
      }
    ]
  },

  orc: {
    id: "orc",
    name: "Orc",
    tier: 2,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "lineman",
        name: "Orc Lineman",
        ma: 5,
        st: 3,
        ag: 3,
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
        pa: 3,
        av: 8,
        cost: 40000,
        max: 4,
        skills: ["Dodge", "Right Stuff", "Stunty"]
      },
      {
        id: "thrower",
        name: "Orc Thrower",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 3,
        av: 9,
        cost: 75000,
        max: 2,
        skills: ["Pass", "Sure Hands"]
      },
      {
        id: "blitzer",
        name: "Orc Blitzer",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 10,
        cost: 85000,
        max: 2,
        skills: ["Block", "Break Tackle"]
      },
      {
        id: "big-un-blocker",
        name: "Big Un Blocker",
        ma: 5,
        st: 4,
        ag: 4,
        pa: 6,
        av: 10,
        cost: 95000,
        max: 2,
        skills: ["Mighty Blow", "Taunt", "Thick Skull", "Unsteady"]
      },
      {
        id: "untrained-troll",
        name: "Untrained Troll",
        ma: 4,
        st: 5,
        ag: 5,
        pa: 5,
        av: 10,
        cost: 115000,
        max: 1,
        skills: ["Always Hungry", "Loner (4+)", "Mighty Blow", "Projectile Vomit", "Really Stupid", "Regeneration", "Throw Team Mate"]
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
        max: 16,
        skills: ["Dodge", "Stunty"]
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
        max: 2,
        skills: ["Dodge", "On the Ball", "Shadowing", "Stunty"]
      },
      {
        id: "saurus-blocker",
        name: "Saurus Blocker",
        ma: 6,
        st: 4,
        ag: 5,
        pa: 6,
        av: 10,
        cost: 90000,
        max: 6,
        skills: ["Juggernaut", "Unsteady"]
      },
      {
        id: "kroxigor",
        name: "Kroxigor",
        ma: 6,
        st: 5,
        ag: 5,
        pa: 6,
        av: 10,
        cost: 140000,
        max: 1,
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow", "Prehensile Tail", "Thick Skull"]
      }
    ]
  },

  imperialNobility: {
    id: "imperial-nobility",
    name: "Imperial Nobility",
    tier: 2,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "imperial-retainer",
        name: "Imperial Retainer",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 45000,
        max: 16,
        skills: ["Fend"]
      },
      {
        id: "imperial-thrower",
        name: "Imperial Thrower",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 2,
        av: 9,
        cost: 75000,
        max: 2,
        skills: ["Pass", "Give and Go", "Pro"]
      },
      {
        id: "bodyguard",
        name: "Bodyguard",
        ma: 5,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 85000,
        max: 4,
        skills: ["Stand Firm", "Wrestle"]
      },
      {
        id: "noble-blitzer",
        name: "Noble Blitzer",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 90000,
        max: 2,
        skills: ["Block", "Catch", "Pro"]
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
        skills: ["Bone Head", "Loner (3+)", "Mighty Blow", "Thick Skull", "Throw Team-mate"]
      }
    ]
  },

  blackOrcs: {
    id: "black-orcs",
    name: "Black Orcs",
    tier: 3,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "goblin-bruiser-lineman",
        name: "Goblin Bruiser",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 45000,
        max: 16,
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
        skills: ["Always Hungry", "Mighty Blow", "Projectile Vomit", "Really Stupid", "Regeneration", "Throw Team-mate"]
      }
    ]
  },

  bretonnian: {
    id: "bretonnian",
    name: "Bretonnian",
    tier: 2,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "squire",
        name: "Bretonnian Squire",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 50000,
        max: 16,
        skills: ["Wrestle"]
      },
      {
        id: "knight-thrower",
        name: "Bretonnian Knight Thrower",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 3,
        av: 9,
        cost: 80000,
        max: 2,
        skills: ["Dauntless", "Nerves of Steel", "Pass"]
      },
      {
        id: "knight-catcher",
        name: "Bretonnian Knight Catcher",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 85000,
        max: 2,
        skills: ["Dauntless", "Catch", "Nerves of Steel"]
      },
      {
        id: "grail-knight",
        name: "Grail Knight",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 10,
        cost: 95000,
        max: 2,
        skills: ["Block", "Dauntless", "Steady Footing"]
      }
    ]
  },

  chaosChosen: {
    id: "chaos-chosen",
    name: "Chaos Chosen",
    tier: 1,
    rerollCost: 50000,
    apothecary: true,
    players: [
      {
        id: "beastman-lineman",
        name: "Beastman Lineman",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 55000,
        max: 16,
        skills: ["Horns", "Thick Skull"]
      },
      {
        id: "chaos-chosen-blocker",
        name: "Chaos Chosen Blocker",
        ma: 5,
        st: 4,
        ag: 3,
        pa: 5,
        av: 10,
        cost: 100000,
        max: 4,
        skills: ["Arm Bar"]
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
        skills: [
          "Always Hungry",
          "Loner (4+)",
          "Mighty Blow",
          "Projectile Vomit",
          "Really Stupid",
          "Regeneration",
          "Throw Team Mate"
        ]
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
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow", "Thick Skull", "Throw Team Mate"]
      },
      {
        id: "minotaur",
        name: "Minotaur",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 6,
        av: 9,
        cost: 150000,
        max: 1,
        skills: [
          "Loner (4+)",
          "Frenzy",
          "Horns",
          "Mighty Blow",
          "Thick Skull",
          "Unchannelled Fury"
        ]
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
        max: 16
      },
      {
        id: "sneaky-stabba",
        name: "Sneaky Stabba",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 5,
        av: 8,
        cost: 60000,
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
        id: "flamesmith",
        name: "FlameSmith",
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
        id: "bull-centaur",
        name: "Bull Centaur",
        ma: 6,
        st: 4,
        ag: 4,
        pa: 6,
        av: 10,
        cost: 130000,
        max: 2,
        skills: ["Sprint", "Sure Feet", "Thick Skull", "Unsteady"]
      },
      {
        id: "minotaur",
        name: "Minotaur",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 6,
        av: 9,
        cost: 150000,
        max: 1,
        skills: [
          "Frenzy",
          "Horns",
          "Loner (4+)",
          "Mighty Blow",
          "Thick Skull",
          "Unchannelled Fury"
        ]
      }
    ]
  },

  chaosRenegade: {
    id: "chaos-renegade",
    name: "Chaos Renegade",
    tier: 2,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "renegade-human-lineman",
        name: "Renegade Human Lineman",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 50000,
        max: 16,
        skills: ["Animosity (all team-mates)"]
      },
      {
        id: "renegade-human-thrower",
        name: "Renegade Human Thrower",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 3,
        av: 9,
        cost: 75000,
        max: 1,
        skills: ["Animosity (all team-mates)", "Pass", "Sure Hands"]
      },
      {
        id: "renegade-goblin",
        name: "Renegade Goblin",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 40000,
        max: 1,
        skills: ["Animosity (all team-mates)", "Dodge", "Right Stuff", "Stunty"]
      },
      {
        id: "renegade-orc",
        name: "Renegade Orc",
        ma: 5,
        st: 3,
        ag: 3,
        pa: 5,
        av: 10,
        cost: 50000,
        max: 1,
        skills: ["Animosity (all team-mates)"]
      },
      {
        id: "renegade-skaven",
        name: "Renegade Skaven",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 50000,
        max: 1,
        skills: ["Animosity (all team-mates)"]
      },
      {
        id: "renegade-dark-elf",
        name: "Renegade Dark Elf",
        ma: 6,
        st: 3,
        ag: 2,
        pa: 3,
        av: 9,
        cost: 65000,
        max: 1,
        skills: ["Animosity (all team-mates)"]
      },
      {
        id: "renegade-troll",
        name: "Renegade Troll",
        ma: 4,
        st: 5,
        ag: 5,
        pa: 5,
        av: 10,
        cost: 115000,
        max: 1,
        skills: [
          "Always Hungry",
          "Loner (4+)",
          "Mighty Blow",
          "Projectile Vomit",
          "Really Stupid",
          "Regeneration",
          "Throw Team Mate"
        ]
      },
      {
        id: "renegade-ogre",
        name: "Renegade Ogre",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 5,
        av: 10,
        cost: 140000,
        max: 1,
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow", "Thick Skull", "Throw Team Mate"]
      },
      {
        id: "renegade-minotaur",
        name: "Renegade Minotaur",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 6,
        av: 9,
        cost: 150000,
        max: 1,
        skills: [
          "Loner (4+)",
          "Frenzy",
          "Horns",
          "Mighty Blow",
          "Thick Skull",
          "Unchannelled Fury"
        ]
      },
      {
        id: "renegade-rat-ogre",
        name: "Renegade Rat Ogre",
        ma: 6,
        st: 5,
        ag: 4,
        pa: 6,
        av: 9,
        cost: 150000,
        max: 1,
        skills: [
          "Animal Savagery",
          "Frenzy",
          "Loner (4+)",
          "Mighty Blow",
          "Prehensile Tail"
        ]
      }
    ]
  },

  daemonsOfKhorne: {
    id: "daemons-of-khorne",
    name: "Daemons of Khorne",
    tier: 2,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "pit-fighter",
        name: "Pit Fighter",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 60000,
        max: 16,
        skills: ["Frenzy"]
      },
      {
        id: "bloodletter",
        name: "Bloodletter",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 80000,
        max: 4,
        skills: ["Horns", "Juggernaut", "Regeneration"]
      },
      {
        id: "khorne-herald",
        name: "Khorne Herald",
        ma: 5,
        st: 3,
        ag: 4,
        pa: 5,
        av: 9,
        cost: 90000,
        max: 4,
        skills: ["Frenzy", "Horns", "Juggernaut"]
      },
      {
        id: "bloodthirster",
        name: "Bloodthirster",
        ma: 6,
        st: 5,
        ag: 5,
        av: 10,
        cost: 180000,
        max: 1,
        skills: [
          "Claw",
          "Frenzy",
          "Horns",
          "Juggernaut",
          "Loner (4+)",
          "Unchannelled Fury",
          "Regeneration"
        ]
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
        pa: 3,
        av: 9,
        cost: 65000,
        max: 16
      },
      {
        id: "dark-elf-runner",
        name: "Dark Elf Runner",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 3,
        av: 8,
        cost: 80000,
        max: 2,
        skills: ["Dump-Off", "Punt"]
      },
      {
        id: "dark-elf-assassin",
        name: "Dark Elf Assassin",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 4,
        av: 8,
        cost: 90000,
        max: 2,
        skills: ["Hit and Run", "Shadowing", "Stab"]
      },
      {
        id: "dark-elf-blitzer",
        name: "Dark Elf Blitzer",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 3,
        av: 9,
        cost: 105000,
        max: 2,
        skills: ["Block"]
      },
      {
        id: "witch-elf",
        name: "Witch Elf",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 4,
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
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "dwarf-lineman",
        name: "Dwarf Lineman",
        ma: 4,
        st: 3,
        ag: 4,
        pa: 5,
        av: 10,
        cost: 70000,
        max: 16,
        skills: ["Block", "Defensive", "Thick Skull"]
      },
      {
        id: "dwarf-runner",
        name: "Dwarf Runner",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 80000,
        max: 2,
        skills: ["Sprint", "Sure Hands", "Thick Skull"]
      },
      {
        id: "troll-slayer",
        name: "Troll Slayer",
        ma: 5,
        st: 3,
        ag: 4,
        pa: 5,
        av: 9,
        cost: 95000,
        max: 2,
        skills: ["Block", "Dauntless", "Frenzy", "Hatred (Troll)", "Thick Skull"]
      },
      {
        id: "dwarf-blitzer",
        name: "Dwarf Blitzer",
        ma: 5,
        st: 3,
        ag: 4,
        pa: 4,
        av: 10,
        cost: 100000,
        max: 2,
        skills: ["Block", "Diving Tackle", "Tackle", "Thick Skull"]
      },
      {
        id: "deathroller",
        name: "Deathroller",
        ma: 5,
        st: 7,
        ag: 5,
        av: 11,
        cost: 170000,
        max: 1,
        skills: ["Break Tackle", "Dirty Player", "Juggernaut", "Loner (4+)", "Mighty Blow", "No Ball", "Secret Weapon", "Stand Firm"]
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
        id: "elf-lineman",
        name: "Elf Lineman",
        ma: 6,
        st: 3,
        ag: 2,
        pa: 3,
        av: 8,
        cost: 65000,
        max: 16,
        skills: ["Fumblerooski"]
      },
      {
        id: "elf-thrower",
        name: "Elf Thrower",
        ma: 6,
        st: 3,
        ag: 2,
        pa: 2,
        av: 8,
        cost: 75000,
        max: 2,
        skills: ["Hail Mary Pass", "Pass"]
      },
      {
        id: "elf-catcher",
        name: "Elf Catcher",
        ma: 8,
        st: 3,
        ag: 2,
        pa: 4,
        av: 8,
        cost: 100000,
        max: 2,
        skills: ["Catch", "Diving Catch", "Nerves of Steel"]
      },
      {
        id: "elf-blitzer",
        name: "Elf Blitzer",
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

  gnomes: {
    id: "gnomes",
    name: "Gnomes",
    tier: 4,
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
        skills: ["Jump Up", "Dodge", "Stunty", "Wrestle"]
      },
      {
        id: "fox",
        name: "Woodland Fox",
        ma: 7,
        st: 2,
        ag: 2,
        av: 6,
        cost: 50000,
        max: 2,
        skills: ["Dodge", "My Ball", "Sidestep", "Stunty"]
      },
      {
        id: "gnome-illustionist",
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
        id: "altern-forest-treeman",
        name: "Altern Forest Treeman",
        ma: 2,
        st: 6,
        ag: 5,
        pa: 5,
        av: 11,
        cost: 120000,
        max: 2,
        skills: ["Mighty Blow", "Stand Firm", "Strong Arm", "Take Root", "Thick Skull", "Throw Team-mate", "Timmm-Ber!"]
      }
    ]
  },

  goblins: {
    id: "goblins",
    name: "Goblins",
    tier: 4,
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
        skills: ["Escurridizo", "Esquivar", "Humanoide Bala"]
      },
      {
        id: "looney",
        name: "Looney",
        ma: 6,
        st: 2,
        ag: 3,
        av: 8,
        cost: 40000,
        max: 1,
        skills: ["Arma Secreta", "Escurridizo", "Motosierra"]
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
        skills: ["Arma Secreta", "Bombardero", "Esquivar", "Escurridizo"]
      },
      {
        id: "ooligan",
        name: "'Ooligan",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 5,
        av: 8,
        cost: 60000,
        max: 1,
        skills: [
          "Esquivar",
          "Escurridizo",
          "Humanoide Bala",
          "Jugar Sucio",
          "Presencia Perturbadora",
          "Provocar"
        ]
      },
      {
        id: "doom-diver",
        name: "Doom Diver",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 6,
        av: 8,
        cost: 65000,
        max: 1,
        skills: ["Escurridizo", "Esquivar", "Humanoide Bala", "Planear"]
      },
      {
        id: "fanatic",
        name: "Fanático",
        ma: 3,
        st: 7,
        ag: 3,
        av: 8,
        cost: 70000,
        max: 1,
        skills: ["Arma Secreta", "Bola y Cadena", "Escurridizo"]
      },
      {
        id: "pogoer",
        name: "Pogo Saltarín",
        ma: 7,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 75000,
        max: 1,
        skills: ["Escurridizo", "Esquivar", "Pogo Saltarín"]
      },
      {
        id: "trained-troll",
        name: "Troll Entrenado",
        ma: 4,
        st: 5,
        ag: 5,
        pa: 5,
        av: 10,
        cost: 115000,
        max: 2,
        skills: [
          "Golpe Mortífero (+1)",
          "Lanzar Compañero",
          "Proyectil Vómito",
          "Realmente Estúpido",
          "Regeneración",
          "Siempre Hambriento"
        ]
      }
    ]
  },

  halflings: {
    id: "halflings",
    name: "Halflings",
    tier: 3,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "halfling-lineman",
        name: "Halfling Lineman",
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
        id: "halfling-catcher",
        name: "Halfling Catcher",
        ma: 7,
        st: 2,
        ag: 3,
        pa: 4,
        av: 7,
        cost: 45000,
        max: 2,
        skills: ["Catch", "Dodge", "Right Stuff", "Sidestep", "Stunty"]
      },
      {
        id: "halfling-blitzer",
        name: "Halfling Blitzer",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 60000,
        max: 2,
        skills: ["Block", "Dodge", "Right Stuff", "Stunty"]
      },
      {
        id: "treeman",
        name: "Treeman",
        ma: 2,
        st: 6,
        ag: 1,
        pa: 6,
        av: 11,
        cost: 140000,
        max: 1,
        skills: ["Loner (3+)", "Mighty Blow", "Regeneration", "Stand Firm", "Thick Skull", "Unsteady"]
      }
    ]
  },

  highElf: {
    id: "high-elf",
    name: "High Elf",
    tier: 1,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "high-elf-lineman",
        name: "High Elf Lineman",
        ma: 6,
        st: 3,
        ag: 2,
        pa: 3,
        av: 9,
        cost: 60000,
        max: 16,
        skills: []
      },
      {
        id: "high-elf-blitzer",
        name: "High Elf Blitzer",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 4,
        av: 9,
        cost: 85000,
        max: 4,
        skills: ["Block", "Dodge"]
      },
      {
        id: "high-elf-archer",
        name: "High Elf Archer",
        ma: 6,
        st: 3,
        ag: 2,
        pa: 4,
        av: 9,
        cost: 80000,
        max: 2,
        skills: ["Dodge", "Pass", "Accurate"]
      },
      {
        id: "high-elf-thrower",
        name: "High Elf Thrower",
        ma: 6,
        st: 3,
        ag: 2,
        pa: 2,
        av: 9,
        cost: 90000,
        max: 2,
        skills: ["Hail Mary Pass", "Pass", "Safe Pass"]
      }
    ]
  },

  khorne: {
    id: "khorne",
    name: "Khorne",
    tier: 2,
    rerollCost: 70000,
    apothecary: false,
    players: [
      {
        id: "bloodletter-lineman",
        name: "Bloodletter Lineman",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 70000,
        max: 16,
        skills: ["Horns", "Regeneration"]
      },
      {
        id: "bloodletter-blocker",
        name: "Bloodletter Blocker",
        ma: 5,
        st: 4,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 90000,
        max: 4,
        skills: ["Frenzy", "Horns", "Juggernaut"]
      },
      {
        id: "bloodthirster",
        name: "Bloodthirster",
        ma: 6,
        st: 5,
        ag: 5,
        pa: 5,
        av: 10,
        cost: 180000,
        max: 1,
        skills: ["Claw", "Frenzy", "Horns", "Juggernaut", "Loner (4+)", "Regeneration", "Unchannelled Fury"]
      }
    ]
  },

  necromanticHorror: {
    id: "necromantic-horror",
    name: "Necromantic Horror",
    tier: 2,
    rerollCost: 70000,
    apothecary: false,
    players: [
      {
        id: "zombie-lineman",
        name: "Zombie Lineman",
        ma: 4,
        st: 3,
        ag: 4,
        pa: 6,
        av: 9,
        cost: 40000,
        max: 16,
        skills: ["Eye Gouge", "Regeneration", "Unsteady"]
      },
      {
        id: "ghoul-runner",
        name: "Ghoul Runner",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 3,
        av: 8,
        cost: 75000,
        max: 2,
        skills: ["Dodge", "Regeneration"]
      },
      {
        id: "wraith",
        name: "Wraith",
        ma: 6,
        st: 3,
        ag: 3,
        av: 9,
        cost: 85000,
        max: 2,
        skills: ["Block", "Foul Appearance", "No Ball", "Regeneration", "Sidestep"]
      },
      {
        id: "flesh-golem",
        name: "Flesh Golem",
        ma: 4,
        st: 4,
        ag: 4,
        pa: 6,
        av: 10,
        cost: 110000,
        max: 2,
        skills: ["Regeneration", "Stand Firm", "Thick Skull", "Unsteady"]
      },
      {
        id: "werewolf",
        name: "Werewolf",
        ma: 8,
        st: 3,
        ag: 3,
        pa: 3,
        av: 9,
        cost: 120000,
        max: 2,
        skills: ["Claws", "Frenzy", "Regeneration"]
      }
    ]
  },

  norse: {
    id: "norse",
    name: "Norse",
    tier: 1,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "beer-boar",
        name: "Beer Boar",
        ma: 5,
        st: 1,
        ag: 3,
        av: 6,
        cost: 20000,
        max: 2,
        skills: ["Dodge", "No Ball", "Pick-me-up", "Stunty", "Titchy"]
      },
      {
        id: "norse-raider",
        name: "Norse Raider",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 50000,
        max: 16,
        skills: ["Block", "Drunkard", "Thick Skull", "Unsteady"]
      },
      {
        id: "berserker",
        name: "Norse Berserker",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 90000,
        max: 2,
        skills: ["Block", "Frenzy", "Jump Up"]
      },
      {
        id: "valkyrie",
        name: "Valkyrie",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 3,
        av: 8,
        cost: 95000,
        max: 2,
        skills: ["Catch", "Dauntless", "Pass", "Strip Ball"]
      },
      {
        id: "ulfwerener",
        name: "Ulfwerener",
        ma: 6,
        st: 4,
        ag: 4,
        pa: 6,
        av: 9,
        cost: 105000,
        max: 2,
        skills: ["Frenzy", "Unsteady"]
      },
      {
        id: "yhetee",
        name: "Yhetee",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 6,
        av: 9,
        cost: 90000,
        max: 2,
        skills: ["Claws", "Disturbing Presence", "Frenzy", "Loner (4+)", "Unchannelled Fury"]
      }
    ]
  },

  nurgle: {
    id: "nurgle",
    name: "Nurgle",
    tier: 2,
    rerollCost: 70000,
    apothecary: false,
    players: [
      {
        id: "nurgle-lineman",
        name: "Nurgle Lineman",
        ma: 5,
        st: 3,
        ag: 4,
        pa: 5,
        av: 10,
        cost: 60000,
        max: 16,
        skills: ["Regeneration", "Unsteady"]
      },
      {
        id: "pestigor",
        name: "Pestigor",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 70000,
        max: 4,
        skills: ["Horns", "Regeneration"]
      },
      {
        id: "rot-fly",
        name: "Rot Fly",
        ma: 7,
        st: 2,
        ag: 3,
        pa: 3,
        av: 8,
        cost: 65000,
        max: 2,
        skills: ["Dodge", "Regeneration", "Right Stuff", "Stunty"]
      },
      {
        id: "beast-of-nurgle",
        name: "Beast of Nurgle",
        ma: 6,
        st: 4,
        ag: 5,
        pa: 6,
        av: 10,
        cost: 110000,
        max: 1,
        skills: ["Frenzy", "Loner (4+)", "Mighty Blow", "Prehensile Tail", "Regeneration"]
      }
    ]
  },

  ogres: {
    id: "ogres",
    name: "Ogres",
    tier: 4,
    rerollCost: 70000,
    apothecary: true,
    players: [
      {
        id: "gnoblar",
        name: "Gnoblar",
        ma: 5,
        st: 1,
        ag: 3,
        pa: 4,
        av: 6,
        cost: 15000,
        max: 16,
        skills: ["Dodge", "Right Stuff", "Sidestep", "Stunty", "Titchy"]
      },
      {
        id: "ogre-blocker",
        name: "Ogre Blocker",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 5,
        av: 10,
        cost: 140000,
        max: 5,
        skills: ["Bone Head", "Mighty Blow", "Thick Skull", "Throw Team-Mate"]
      },
            {
        id: "ogre-runt-punter",
        name: "Ogre Runt Punter",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 4,
        av: 10,
        cost: 145000,
        max: 1,
        skills: ["Bone Head", "Mighty Blow", "Thick Skull", "Kick Team-Mate"]
      }
    ]
  },

  oldWorldAlliance: {
    id: "old-world-alliance",
    name: "Old World Alliance",
    tier: 2,
    rerollCost: 70000,
    apothecary: true,
    players: [
      {
        id: "alliance-lineman",
        name: "Alliance Lineman",
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
        id: "dwarf-ally",
        name: "Dwarf Ally",
        ma: 4,
        st: 3,
        ag: 4,
        pa: 5,
        av: 10,
        cost: 70000,
        max: 4,
        skills: ["Block", "Defensive", "Thick Skull"]
      },
      {
        id: "elf-ally",
        name: "Elf Ally",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 3,
        av: 9,
        cost: 85000,
        max: 2,
        skills: ["Dodge"]
      },
      {
        id: "ogre-ally",
        name: "Ogre Ally",
        ma: 5,
        st: 5,
        ag: 3,
        pa: 5,
        av: 10,
        cost: 130000,
        max: 1,
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow", "Thick Skull", "Throw Team Mate"]
      }
    ]
  },

  shamblingUndead: {
    id: "shambling-undead",
    name: "Shambling Undead",
    tier: 2,
    rerollCost: 70000,
    apothecary: false,
    players: [
      {
        id: "skeleton-lineman",
        name: "Skeleton Lineman",
        ma: 5,
        st: 3,
        ag: 4,
        pa: 6,
        av: 8,
        cost: 40000,
        max: 16,
        skills: ["Regeneration", "Thick Skull"]
      },
      {
        id: "zombie-lineman",
        name: "Zombie Lineman",
        ma: 4,
        st: 3,
        ag: 4,
        pa: 6,
        av: 9,
        cost: 40000,
        max: 16,
        skills: ["Eye Gouge", "Regeneration", "Unsteady"]
      },
      {
        id: "ghoul-runner",
        name: "Ghoul Runner",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 3,
        av: 8,
        cost: 75000,
        max: 2,
        skills: ["Dodge", "Regeneration"]
      },
      {
        id: "wight-blitzer",
        name: "Wight Blitzer",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 5,
        av: 9,
        cost: 95000,
        max: 2,
        skills: ["Block", "Regeneration", "Tackle", "Thick Skull"]
      },
      {
        id: "mummy",
        name: "Mummy",
        ma: 3,
        st: 5,
        ag: 5,
        pa: 6,
        av: 10,
        cost: 125000,
        max: 2,
        skills: ["Mighty Blow", "Regeneration"]
      }
    ]
  },

  skaven: {
    id: "skaven",
    name: "Skaven",
    tier: 1,
    rerollCost: 50000,
    apothecary: true,
    players: [
      {
        id: "skaven-clanrat",
        name: "Skaven Clanrat",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 50000,
        max: 16,
        skills: []
      },
      {
        id: "skaven-thrower",
        name: "Skaven Thrower",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 2,
        av: 8,
        cost: 80000,
        max: 2,
        skills: ["Pass", "Sure Hands"]
      },
      {
        id: "gutter-runner",
        name: "Gutter Runner",
        ma: 9,
        st: 2,
        ag: 2,
        pa: 4,
        av: 8,
        cost: 85000,
        max: 2,
        skills: ["Dodge", "Stab"]
      },
      {
        id: "skaven-blitzer",
        name: "Skaven Blitzer",
        ma: 8,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 90000,
        max: 2,
        skills: ["Block", "Strip Ball"]
      },
      {
        id: "rat-ogre",
        name: "Rat Ogre",
        ma: 6,
        st: 5,
        ag: 4,
        pa: 6,
        av: 9,
        cost: 150000,
        max: 1,
        skills: ["Animal Savagery", "Frenzy", "Loner (4+)", "Mighty Blow", "Prehensile Tail"]
      }
    ]
  },

  slaanesh: {
    id: "slaanesh",
    name: "Slaanesh",
    tier: 2,
    rerollCost: 70000,
    apothecary: false,
    players: [
      {
        id: "seeker-lineman",
        name: "Seeker Lineman",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 65000,
        max: 16,
        skills: ["Dodge"]
      },
      {
        id: "seeker-blitzer",
        name: "Seeker Blitzer",
        ma: 8,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 95000,
        max: 4,
        skills: ["Block", "Dodge", "Sidestep"]
      },
      {
        id: "daemonette",
        name: "Daemonette",
        ma: 8,
        st: 2,
        ag: 2,
        pa: 3,
        av: 8,
        cost: 80000,
        max: 2,
        skills: ["Dodge", "Frenzy", "Hypnotic Gaze", "Stab"]
      },
      {
        id: "fiend",
        name: "Fiend",
        ma: 6,
        st: 4,
        ag: 4,
        pa: 5,
        av: 9,
        cost: 115000,
        max: 1,
        skills: ["Frenzy", "Loner (4+)", "Mighty Blow", "Ward Save (6+)"]
      }
    ]
  },

  slann: {
    id: "slann",
    name: "Slann",
    tier: 2,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "slann-lineman",
        name: "Slann Lineman",
        ma: 6,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 60000,
        max: 16,
        skills: ["Dodge", "Stunty"]
      },
      {
        id: "slann-catcher",
        name: "Slann Catcher",
        ma: 8,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 75000,
        max: 2,
        skills: ["Catch", "Dodge", "Diving Catch", "Stunty"]
      },
      {
        id: "slann-blitzer",
        name: "Slann Blitzer",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 85000,
        max: 2,
        skills: ["Block", "Dodge", "Sidestep", "Stunty"]
      },
      {
        id: "kroxigor",
        name: "Kroxigor",
        ma: 6,
        st: 5,
        ag: 5,
        pa: 6,
        av: 10,
        cost: 140000,
        max: 1,
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow", "Prehensile Tail", "Thick Skull"]
      }
    ]
  },

  snotling: {
    id: "snotling",
    name: "Snotling",
    tier: 4,
    rerollCost: 70000,
    apothecary: false,
    players: [
      {
        id: "snotling-lineman",
        name: "Snotling Lineman",
        ma: 5,
        st: 1,
        ag: 3,
        pa: 4,
        av: 6,
        cost: 15000,
        max: 16,
        skills: ["Dodge", "Insignificant", "Right Stuff", "Sidestep", "Stunty", "Titchy"]
      },
      {
        id: "fun-hoppa",
        name: "Fun Hoppa",
        ma: 6,
        st: 1,
        ag: 3,
        pa: 4,
        av: 6,
        cost: 20000,
        max: 2,
        skills: ["Dodge", "Pogo Stick", "Right Stuff", "Sidestep", "Stunty"]
      },
      {
        id: "stilty-runna",
        name: "Stilty Runna",
        ma: 6,
        st: 1,
        ag: 3,
        pa: 4,
        av: 6,
        cost: 20000,
        max: 2,
        skills: ["Dodge", "Right Stuff", "Sidestep", "Sprint", "Stunty"]
      },
      {
        id: "fungus-flinga",
        name: "Fungus Flinga",
        ma: 5,
        st: 1,
        ag: 3,
        pa: 4,
        av: 6,
        cost: 30000,
        max: 2,
        skills: ["Bombardier", "Dodge", "Right Stuff", "Secret Weapon", "Sidestep", "Stunty", "Titchy"]
      },
      {
        id: "pump-wagon",
        name: "Pump Wagon",
        ma: 5,
        st: 5,
        ag: 5,
        pa: 6,
        av: 9,
        cost: 100000,
        max: 2,
        skills: ["Dirty Player", "Juggernaut", "Mighty Blow", "Really Stupid", "Stand Firm"]
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
        skills: ["Always Hungry", "Mighty Blow", "Projectile Vomit", "Really Stupid", "Regeneration", "Throw Team-mate"]
      }
    ]
  },

  tombKings: {
    id: "tomb-kings",
    name: "Tomb Kings",
    tier: 2,
    rerollCost: 60000,
    apothecary: false,
    players: [
      {
        id: "skeleton-lineman",
        name: "Skeleton Lineman",
        ma: 5,
        st: 3,
        ag: 4,
        pa: 6,
        av: 8,
        cost: 40000,
        max: 16,
        skills: ["Regeneration", "Thick Skull"]
      },
      {
        id: "tomb-kings-thrower",
        name: "Tomb Kings Thrower",
        ma: 6,
        st: 3,
        ag: 4,
        pa: 3,
        av: 9,
        cost: 65000,
        max: 2,
        skills: ["Pass", "Regeneration", "Sure Hands", "Thick Skull"]
      },
      {
        id: "tomb-kings-blitzer",
        name: "Tomb Kings Blitzer",
        ma: 6,
        st: 3,
        ag: 4,
        pa: 5,
        av: 9,
        cost: 85000,
        max: 2,
        skills: ["Block", "Regeneration", "Think Skull"]
      },
      {
        id: "tomb-guardian",
        name: "Tomb Guardian",
        ma: 4,
        st: 5,
        ag: 5,
        pa: 6,
        av: 10,
        cost: 115000,
        max: 4,
        skills: ["Brawler", "Decay", "Regeneration"]
      }
    ]
  },

  underworldDenizens: {
    id: "underworld-denizens",
    name: "Underworld Denizens",
    tier: 2,
    rerollCost: 70000,
    apothecary: true,
    players: [
      {
        id: "underworld-goblin",
        name: "Underworld Goblin Lineman",
        ma: 6,
        st: 2,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 40000,
        max: 12,
        skills: ["Dodge", "Stunty", "Right Stuff"]
      },
      {
        id: "underworld-snotling",
        name: "Underworld Snotling",
        ma: 5,
        st: 1,
        ag: 3,
        pa: 4,
        av: 6,
        cost: 15000,
        max: 6,
        skills: ["Dodge", "Insignificant", "Right Stuff", "Sidestep", "Stunty", "Titchy"]
      },
      {
        id: "skaven-clanrat",
        name: "Skaven Clanrat",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 4,
        av: 8,
        cost: 50000,
        max: 3,
        skills: ["Animosity (Goblins)"]
      },
      {
        id: "skaven-thrower",
        name: "Skaven Thrower",
        ma: 7,
        st: 3,
        ag: 3,
        pa: 2,
        av: 8,
        cost: 80000,
        max: 1,
        skills: ["Animosity (Goblins)", "Pass", "Sure Hands"]
      },
      {
        id: "gutter-runner",
        name: "Gutter Runner",
        ma: 9,
        st: 2,
        ag: 2,
        pa: 4,
        av: 8,
        cost: 85000,
        max: 1,
        skills: ["Animosity (Goblins)", "Dodge", "Stab"]
      },
      {
        id: "skaven-blitzer",
        name: "Skaven Blitzer",
        ma: 8,
        st: 3,
        ag: 3,
        pa: 4,
        av: 9,
        cost: 90000,
        max: 1,
        skills: ["Animosity (Goblins)", "Block", "Strip Ball"]
      },
      {
        id: "underworld-troll",
        name: "Underworld Troll",
        ma: 4,
        st: 5,
        ag: 5,
        pa: 5,
        av: 10,
        cost: 115000,
        max: 1,
        skills: [
          "Always Hungry",
          "Loner (4+)",
          "Mighty Blow",
          "Projectile Vomit",
          "Really Stupid",
          "Regeneration",
          "Throw Team Mate"
        ]
      },
      {
        id: "mutant-rat-ogre",
        name: "Mutant Rat Ogre",
        ma: 6,
        st: 5,
        ag: 4,
        pa: 6,
        av: 9,
        cost: 150000,
        max: 1,
        skills: [
          "Animal Savagery",
          "Frenzy",
          "Loner (4+)",
          "Mighty Blow",
          "Prehensile Tail"
        ]
      }
    ]
  },

  vampire: {
    id: "vampire",
    name: "Vampire",
    tier: 2,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "thrall",
        name: "Thrall Lineman",
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
        id: "vampire-runner",
        name: "Vampire Runner",
        ma: 8,
        st: 3,
        ag: 2,
        pa: 3,
        av: 8,
        cost: 100000,
        max: 2,
        skills: ["Bloodlust (2+)", "Hypnotic Gaze", "Regeneration"]
      },
      {
        id: "vampire-thrower",
        name: "Vampire Thrower",
        ma: 6,
        st: 4,
        ag: 2,
        pa: 2,
        av: 9,
        cost: 110000,
        max: 2,
        skills: ["Bloodlust (2+)", "Hypnotic Gaze", "Pass", "Regeneration"]
      },
      {
        id: "vampire-blitzer",
        name: "Vampire Blitzer",
        ma: 6,
        st: 4,
        ag: 2,
        pa: 4,
        av: 9,
        cost: 110000,
        max: 2,
        skills: ["Bloodlust (3+)", "Hypnotic Gaze", "Juggernaut", "Regeneration"]
      },
      {
        id: "vargheist",
        name: "Varghiest",
        ma: 5,
        st: 5,
        ag: 4,
        pa: 6,
        av: 10,
        cost: 150000,
        max: 1,
        skills: ["Bloodlust (3+)", "Claws", "Frenzy", "Loner (4+)", "Regeneration"]
      }
    ]
  },

  woodElf: {
    id: "wood-elf",
    name: "Wood Elf",
    tier: 1,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "wood-elf-lineman",
        name: "Wood Elf Lineman",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 3,
        av: 8,
        cost: 70000,
        max: 16,
        skills: ["Dodge"]
      },
      {
        id: "wood-elf-catcher",
        name: "Wood Elf Catcher",
        ma: 8,
        st: 3,
        ag: 2,
        pa: 4,
        av: 8,
        cost: 85000,
        max: 2,
        skills: ["Catch", "Dodge", "Sidestep"]
      },
      {
        id: "wood-elf-blitzer",
        name: "Wood Elf Blitzer",
        ma: 7,
        st: 3,
        ag: 2,
        pa: 3,
        av: 9,
        cost: 95000,
        max: 2,
        skills: ["Block", "Dodge", "Sidestep"]
      },
      {
        id: "astromancer",
        name: "Astromancer",
        ma: 6,
        st: 3,
        ag: 2,
        pa: 2,
        av: 9,
        cost: 85000,
        max: 2,
        skills: ["Magic", "Pass", "Sure Hands"]
      }
    ]
  }
};

