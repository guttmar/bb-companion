import type { TeamMap } from "./types";
import { bb2020Teams } from "./bb2020";

export const bb2025Teams: TeamMap = {
  ...bb2020Teams,

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
        av: 10,
        cost: 140000,
        max: 1,
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow (+1)", "Prehensile Tail", "Thick Skull"]
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
        name: "Imperial Retainer Lineman",
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
        id: "noble-blitzer",
        name: "Imperial Noble Blitzer",
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
        id: "bodyguard",
        name: "Imperial Bodyguard",
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

  blackOrcs: {
    id: "black-orcs",
    name: "Black Orcs",
    tier: 1,
    rerollCost: 60000,
    apothecary: true,
    players: []
  },

  bretonnia: {
    id: "bretonnia",
    name: "Bretonnia",
    tier: 1,
    rerollCost: 60000,
    apothecary: true,
    players: [
      {
        id: "squire",
        name: "Squire",
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
        id: "knight-catcher",
        name: "Knight Catcher",
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
        id: "knight-thrower",
        name: "Knight Thrower",
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
          "Mighty Blow (+1)",
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
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow (+1)", "Thick Skull", "Throw Team Mate"]
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
          "Mighty Blow (+1)",
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
    rerollCost: 60000,
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
        skills: ["Block", "Iron-hard Skin", "Thick Skull"]
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
        skills: ["Sprint", "Sure Feet", "Thick Skull"]
      },
      {
        id: "enslaved-minotaur",
        name: "Enslaved Minotaur",
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
          "Mighty Blow (+1)",
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
          "Mighty Blow (+1)",
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
        skills: ["Bone Head", "Loner (4+)", "Mighty Blow (+1)", "Thick Skull", "Throw Team Mate"]
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
          "Mighty Blow (+1)",
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
          "Mighty Blow (+1)",
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
        max: 4,
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
    rerollCost: 50000,
    apothecary: true,
    players: []
  },

  elvenUnion: {
    id: "elven-union",
    name: "Elven Union",
    tier: 1,
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
        skills: ["Fumblerooskie"]
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
        skills: ["Block", "Side Step"]
      }
    ]
  },

  gnomes: {
    id: "gnomes",
    name: "Gnomes",
    tier: 2,
    rerollCost: 60000,
    apothecary: true,
    players: []
  },

  goblins: {
    id: "goblins",
    name: "Goblins",
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
    players: []
  },

  highElf: {
    id: "high-elf",
    name: "High Elf",
    tier: 1,
    rerollCost: 50000,
    apothecary: true,
    players: []
  },

  khorne: {
    id: "khorne",
    name: "Khorne",
    tier: 2,
    rerollCost: 70000,
    apothecary: true,
    players: []
  },

  necromanticHorrors: {
    id: "necromantic-horrors",
    name: "Necromantic Horrors",
    tier: 2,
    rerollCost: 70000,
    apothecary: false,
    players: []
  },

  norses: {
    id: "norses",
    name: "Norses",
    tier: 1,
    rerollCost: 60000,
    apothecary: true,
    players: []
  },

  nurgle: {
    id: "nurgle",
    name: "Nurgle",
    tier: 2,
    rerollCost: 70000,
    apothecary: true,
    players: []
  },

  ogres: {
    id: "ogres",
    name: "Ogres",
    tier: 3,
    rerollCost: 70000,
    apothecary: true,
    players: []
  },

  oldWorldAlliance: {
    id: "old-world-alliance",
    name: "Old World Alliance",
    tier: 2,
    rerollCost: 70000,
    apothecary: true,
    players: []
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
        skills: ["Mighty Blow (+1)", "Regeneration"]
      }
    ]
  },

  skavens: {
    id: "skavens",
    name: "Skavens",
    tier: 1,
    rerollCost: 60000,
    apothecary: true,
    players: []
  },

  slaanesh: {
    id: "slaanesh",
    name: "Slaanesh",
    tier: 2,
    rerollCost: 70000,
    apothecary: true,
    players: []
  },

  slann: {
    id: "slann",
    name: "Slann",
    tier: 2,
    rerollCost: 70000,
    apothecary: true,
    players: []
  },

  snotlings: {
    id: "snotlings",
    name: "Snotlings",
    tier: 3,
    rerollCost: 60000,
    apothecary: false,
    players: []
  },

  tombKings: {
    id: "tomb-kings",
    name: "Tomb Kings",
    tier: 2,
    rerollCost: 70000,
    apothecary: false,
    players: []
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
        skills: ["Dodge", "Insignificant", "Right Stuff", "Side Step", "Stunty", "Titchy"]
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
          "Mighty Blow (+1)",
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
          "Mighty Blow (+1)",
          "Prehensile Tail"
        ]
      }
    ]
  },

  vampires: {
    id: "vampires",
    name: "Vampires",
    tier: 2,
    rerollCost: 70000,
    apothecary: true,
    players: []
  },

  woodElf: {
    id: "wood-elf",
    name: "Wood Elf",
    tier: 1,
    rerollCost: 50000,
    apothecary: true,
    players: []
  }
};

