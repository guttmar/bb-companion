export type SkillType = "active" | "passive";

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  elite?: boolean;
  description: string;
}

export type SkillCategory =
  | "general"
  | "agility"
  | "pass"
  | "strength"
  | "devious"
  | "mutation"
  | "traits";

export interface SkillCategoryData {
  id: SkillCategory;
  name: string;
  skills: Skill[];
}

const skill = (
  id: string,
  name: string,
  type: SkillType,
  description: string,
  elite?: boolean
): Skill => ({
  id,
  name,
  type,
  description,
  ...(elite && { elite: true })
});

export const bb2025Skills: SkillCategoryData[] = [
  {
    id: "general",
    name: "General",
    skills: [
      skill(
        "block",
        "Block",
        "active",
        "A player with this Skill may choose not to be Knocked Down when a Both Down result is applied during a Block Action that they are part of.",
        true
      ),
      skill(
        "dauntless",
        "Dauntless",
        "active",
        "When a player with this Skill performs a Block Action against an opposition player with a higher Strength Characteristic (before any modifiers are applied to either player), this player may roll a D6 and add their own Strength Characteristic. If the result is higher than the opposition player's unmodified Strength Characteristic, then this player increases their unmodified Strength Characteristic to match that of the opposition player for the duration of the Block Action."
      ),
      skill(
        "fend",
        "Fend",
        "active",
        "When a player with this Skill is Pushed Back as a result of a Block Action performed against them, then the opposition player may not Follow-up. This Skill cannot be used against a player with the Ball & Chain Trait or against a player with the Juggernaut Skill that is performing a Blitz Action."
      ),
      skill(
        "frenzy",
        "Frenzy",
        "active",
        "Every time this player performs a Block Action, if the target is Pushed Back, then this player must Follow-up after the Block Action. If, after the target is Pushed Back they are still Standing, then this player must perform a second Block Action targeting the same opposition player and must again Follow-up if the target is Pushed Back."
      ),
      skill(
        "kick",
        "Kick",
        "active",
        "If this player is nominated as the kicking player, then when Kick-off this player's Coach may choose for it to only deviate D3 squares rather than the usual D6."
      ),
      skill(
        "pro",
        "Pro",
        "active",
        "During this player's activation, they may attempt to re-roll a single dice. This can be a dice rolled on its own, as part of a multiple dice roll or as a dice pool. To use this Skill, the player must roll a D6. On a 3+, the dice may be re-rolled; on a 1-2 the dice may not be re-rolled."
      ),
      skill(
        "steady-footing",
        "Steady Footing",
        "active",
        "Whenever this player would be Knocked Down or Fall Over, roll a D6. On a 6, this player does not get Knocked Down or Fall Over. If this happens during their activation, they may continue their activation as normal and no Turnover will be caused."
      ),
      skill(
        "strip-ball",
        "Strip Ball",
        "active",
        "When this player performs a Block Action against an opposition player holding the ball, if the opposition player is Pushed Back then they will drop the ball in the square they were Pushed Back into, at which point it will Bounce."
      ),
      skill(
        "sure-hands",
        "Sure Hands",
        "active",
        "This player may re-roll the D6 when attempting to pick up the ball, though not when making a Secure the Ball Action. Additionally, the Strip Ball Skill cannot be used against this player."
      ),
      skill(
        "tackle",
        "Tackle",
        "active",
        "When an opposition player attempts to Dodge away from a square in this player's Tackle Zone, they cannot use the Dodge Skill. Additionally, when this player performs a Block Action against an opposition player, the opposition player does not count as having the Dodge Skill if a Stumble result is selected."
      ),
      skill(
        "taunt",
        "Taunt",
        "active",
        "When a player with this Skill is Pushed Back as a result of a Block Action performed against them, this player's Coach may choose to make the opposition player Follow-up. This Skill cannot be used against an opposition player with the Take Root Trait that has become Rooted."
      ),
      skill(
        "wrestle",
        "Wrestle",
        "active",
        "This player may use this Skill when a Both Down result is applied, either when they perform a Block action or when they are the target of a Block action. Instead of applying the Both Down result as normal, and regardless of any other Skills either player may possess, both players are placed Prone."
      )
    ]
  },
  {
    id: "agility",
    name: "Agility",
    skills: [
      skill(
        "catch",
        "Catch",
        "active",
        "This player may re-roll any failed Agility Test when attempting to Catch the ball."
      ),
      skill(
        "defensive",
        "Defensive",
        "active",
        "During your opponent's Turns, opposition players Marked by this player cannot use the Guard or Put the Boot In Skills."
      ),
      skill(
        "diving-catch",
        "Diving Catch",
        "active",
        "This player may attempt to Catch the ball if it lands in a square in their Tackle Zone as a result of a Pass, Throw-in or Kick-off. They may not use this Skill to attempt to Catch the ball if it lands in a square in their Tackle Zone as a result of a Bounce. Additionally, this player may apply a +1 modifier to their Agility Test when attempting to Catch the ball as part of a Pass Action if they are in the target square."
      ),
      skill(
        "diving-tackle",
        "Diving Tackle",
        "active",
        "When an opposition player attempts to leave this player's Tackle Zone as a result of a Dodge, Leap or Jump, after the Agility Test has been rolled and any modifiers and re-rolls have been applied, this player may use this Skill. Immediately apply a -2 modifier to the opposition player's Agility Test and place this player Prone in the square the opposition player vacated."
      ),
      skill(
        "dodge",
        "Dodge",
        "active",
        "Once per Turn, this player may re-roll a single Agility Test when attempting to Dodge. Additionally, this Skill will impact the Stumble result when an opposition player performs a Block Action against this player.",
        true
      ),
      skill(
        "hit-and-run",
        "Hit and Run",
        "active",
        "When a player with this Skill performs a Block Action or a Stab Special Action, after fully resolving the Action, they may immediately move one free square ignoring Tackle Zones, so long as they are still Standing. The player must ensure that after this free move they are not Marked by or Marking any opposition player. A player with this Skill cannot also have the Frenzy Skill."
      ),
      skill(
        "jump-up",
        "Jump Up",
        "active",
        "This Skill can be used whilst a player is Prone. A Prone player with this Skill can Stand up for free, without having to spend 3 squares of movement to do so. Additionally, a Prone player with this Skill can declare a Block Action whilst Prone."
      ),
      skill(
        "leap",
        "Leap",
        "active",
        "During their Move Action, a player with this Skill can attempt to Leap over a single adjacent square regardless of what is in the square. Leaping works the same way as Jumping, with the exception that the Leaping player may reduce the negative modifiers they would receive by Leaping by 1, to a minimum of -1. A player with this Skill cannot also have the Pogo Trait."
      ),
      skill(
        "safe-pair-of-hands",
        "Safe Pair of Hands",
        "active",
        "If this player would be Knocked Down, Fall Over or Placed Prone whilst in possession of the ball, then before they become Prone, they may place the ball in any adjacent unoccupied square to the square they will become Prone in instead of Bouncing the ball as normal."
      ),
      skill(
        "sidestep",
        "Sidestep",
        "active",
        "Whenever this player is Pushed Back for any reason, then instead of the opposing Coach choosing where this player is Pushed Back to, this player's Coach may choose any adjacent unoccupied square for this player to be Pushed Back into instead. If there are no adjacent unoccupied squares, then this Skill cannot be used."
      ),
      skill(
        "sprint",
        "Sprint",
        "active",
        "When this player performs a Move Action they may attempt to Rush one additional time than they would normally be allowed to."
      ),
      skill(
        "sure-feet",
        "Sure Feet",
        "active",
        "Once per Turn, this player may re-roll a single D6 when attempting to Rush."
      )
    ]
  },
  {
    id: "pass",
    name: "Pass",
    skills: [
      skill(
        "accurate",
        "Accurate",
        "active",
        "When this player performs a Pass Action which is a Quick Pass or a Short Pass, this player may apply a +1 modifier to the Passing Ability Test"
      ),
      skill(
        "cannoneer",
        "Cannoneer",
        "active",
        "When this player performs a Pass Action which is a Long Pass or a Long Bomb, this player may apply a +1 modifier to the Passing Ability Test."
      ),
      skill(
        "cloud-burster",
        "Cloud Burster",
        "active",
        "When this player performs a Pass Action, opposition players may not attempt to Intercept the ball."
      ),
      skill(
        "dump-off",
        "Dump-off",
        "active",
        "Whenever an opposition player attempts to perform a Block Action against this player, or a Special Action that targets this player directly, this player may use this Skill. When they do, this player may immediately perform a Quick Pass before the Action targeting them is resolved."
      ),
      skill(
        "give-and-go",
        "Give and Go",
        "active",
        "If this player performs a Pass Action that is a Quick Pass, or performs a Hand-off Action, then, so long as a Turnover isn't caused, their activation does not end once the Pass or Hand-off is resolved. Instead, they may continue with their Move Action using any movement they have remaining."
      ),
      skill(
        "hail-mary-pass",
        "Hail Mary Pass",
        "active",
        "When this player performs a Pass Action or a Throw Bomb Special Action, they may declare any square on the pitch as the target square rather than using the Range Ruler. Make a Passing Ability Test as normal treating the throw as a Long Bomb, and treating any result of an Accurate Pass as an Inaccurate Pass. A Hail Mary Pass cannot be intercepted."
      ),
      skill(
        "leader",
        "Leader",
        "passive",
        "On a team that has one or more players with this Skill, on the pitch at the start of a half may gain a single extra Team Re-roll - this is called a Leader Re-roll."
      ),
      skill(
        "nerves-of-steel",
        "Nerves of Steel",
        "active",
        "This player may ignore any modifiers for being Marked when making an Agility Test to Catch the ball, or when making an Agility Test to Pass the ball."
      ),
      skill(
        "on-the-ball",
        "On the Ball",
        "active",
        "When an opposition player performs a Pass Action, after the target square has been declared but before the Passing Ability Test is rolled, this player may move up to 3 squares, following all the usual rules for a Move Action, with the exception that they cannot Rush."
      ),
      skill(
        "pass",
        "Pass",
        "active",
        "This player may re-roll any failed Passing Ability Test when performing a Pass Action."
      ),
      skill(
        "punt",
        "Punt",
        "active",
        "This player may declare a Punt Special Action; only a single player may declare a Punt Special Action each Turn. When a player declares a Punt Special Action they are first allowed to make a Move Action, though they cannot continue to move after the Punt Special Action has been resolved."
      ),
      skill(
        "safe-pass",
        "Safe Pass",
        "active",
        "If this player rolls a natural 1 when making a Passing Ability Test, then they will result in a Stumble Pass instead, the player retains possession of the ball and their activation immediately ends. No Turnover is caused."
      )
    ]
  },
  {
    id: "strength",
    name: "Strength",
    skills: [
      skill(
        "arm-bar",
        "Arm Bar",
        "active",
        "If an opposing player Falls Over as a result of attempting to Dodge, Leap or Jump away from a square in this player's Tackle Zone, this player may use this Skill. If they do, they may apply a +1 modifier to either the Armour Roll or Injury Roll."
      ),
      skill(
        "brawler",
        "Brawler",
        "active",
        "When this player declares a Block Action, they may re-roll a single Both Down result."
      ),
      skill(
        "break-tackle",
        "Break Tackle",
        "active",
        "Once per Turn, when this player attempts to Dodge, they may apply a +1 modifier to the Agility Test if they have a Strength Characteristic of 3 or lower, a +2 modifier to the Agility Test if they have a Strength Characteristic of 4, or a +3 modifier to the Agility Test if they have a Strength Characteristic of 5 or higher."
      ),
      skill(
        "bullseye",
        "Bullseye",
        "active",
        "When this player performs a Throw Team-mate Action, if the result of the throw is a Superb Throw then the thrown player will not Scatter before landing and will instead land in the target square. A player without the Throw Team-mate Trait cannot have this Skill."
      ),
      skill(
        "grab",
        "Grab",
        "active",
        "When this player declares a Block Action, if the opposition player is Pushed Back, then this player's Coach may choose any unoccupied square adjacent to the target for them to be Pushed Back into. If there are no adjacent unoccupied squares, then this Skill cannot be used. Additionally, when this player performs a Block Action, opposition players cannot use the Sidestep Skill. A player with this Skill cannot have the Frenzy Skill."
      ),
      skill(
        "guard",
        "Guard",
        "active",
        "This player can provide Offensive and Defensive Assists when a player performs a Block Action regardless of how many opposition players are Marking this player.",
        true
      ),
      skill(
        "juggernaut",
        "Juggernaut",
        "active",
        "When this player declares a Blitz Action, they may treat any result of Both Down as Pushed Back during any Block Actions they perform during the Blitz Action. Additionally, when this player performs a Block Actions as a part of a Blitz Action, opposition players cannot use the Fend, Stand Firm or Wrestle Skills."
      ),
      skill(
        "mighty-blow",
        "Mighty Blow",
        "active",
        "Whenever this player Knocks Down an opposition player during a Block Action, even if this player is also Knocked Down, they may apply a +1 modifier to either the Armour Roll or Injury Roll. This modifier may be applied after the roll has been made.",
        true
      ),
      skill(
        "multiple-block",
        "Multiple Block",
        "active",
        "When this player declares a Block Action, they may perform two Block Actions each targeting a different opposition player they are Marking. If they do, then this player will reduce their Strength Characteristic by 2 for the duration of the Block Actions."
      ),
      skill(
        "stand-firm",
        "Stand Firm",
        "active",
        "When this player would be Pushed Back during a Block Action, including during a Chain Push, they can choose to not be Pushed Back and instead remain in their current square. Using this Skill will not prevent a player with the Frenzy Skill from performing a second Block Action, so long as this player is still Standing."
      ),
      skill(
        "strong-arm",
        "Strong Arm",
        "active",
        "When this player performs a Throw Team-mate Action, this player may apply a +1 modifier to the Passing Ability Test. A player without the Throw Team-mate Trait cannot have this Skill."
      ),
      skill(
        "thick-skull",
        "Thick Skull",
        "passive",
        "When an Injury Roll is made for this player, they will only be Knocked-out on the roll of a 9; a roll of an 8 will be treated as a Stunned result. If this player also has the Stunty Trait, then they will only be Knocked-out on the roll of an 8; a roll of a 7 will be treated as a Stunned result."
      )
    ]
  },
  {
    id: "devious",
    name: "Devious",
    skills: [
      skill(
        "dirty-player",
        "Dirty Player",
        "active",
        "When this player performs a Foul Action, they may apply a +1 modifier to either the Armour Roll or Injury Roll. This modifier must be applied after the roll has been made."
      ),
      skill(
        "eye-gouge",
        "Eye Gouge",
        "active",
        "When an opposition player is Pushed Back by this player, the opposition player cannot provide Offensive or Defensive Assists until after they are next activated."
      ),
      skill(
        "fumblerooski",
        "Fumblerooski",
        "active",
        "When this player performs a Move Action whilst they are in possession of the ball, they may choose to place the ball on the ground in any square they move into during their Move Action. This will not cause a Turnover."
      ),
      skill(
        "lethal-flight",
        "Lethal Flight",
        "active",
        "When this player is thrown as part of a Throw Team-mate Action, if they land in a square that contains an opposition player, including if they Bounce into a square containing an opposition player, and the opposition player is Knocked Down, then they may apply a +1 modifier to either the Armour Roll or Injury Roll."
      ),
      skill(
        "lone-fouler",
        "Lone Fouler",
        "active",
        "When this player performs a Foul Action, if there are no players providing an Offensive or Defensive Assist, then this player may re-roll a failed Armour Roll."
      ),
      skill(
        "pile-driver",
        "Pile Driver",
        "active",
        "When an opposition player is Knocked Down by this player during a Block Action, this player may perform a free Foul Action against the opposition player so long as they are still Standing and are not Marking the opposition player. This player is then Placed Prone and their activation immediately ends."
      ),
      skill(
        "put-the-boot-in",
        "Put the Boot In",
        "active",
        "This player can provide Offensive Assists when a team-mate performs a Foul Action regardless of how many opposition players are Marking this player."
      ),
      skill(
        "quick-foul",
        "Quick Foul",
        "active",
        "This player's activation does not end after performing a Foul Action, and they may continue with their Move Action with any movement they have remaining."
      ),
      skill(
        "saboteur",
        "Saboteur",
        "active",
        "When an opposition player is Knocked Down as a result of an opposition player's Block Action, before the Armour Roll is made, they may roll a D6. On a 1-3, nothing happens and the Armour Roll is made as normal. On a 4+, this player's Sabotage weapon goes off and the opposition player is also Knocked Down."
      ),
      skill(
        "shadowing",
        "Shadowing",
        "active",
        "Each time an opposition player attempts to Dodge out of a square within this player's Tackle Zone, this player may use this Skill. When this player uses this Skill, roll a D6. On a 1-3, nothing happens. On a 4+, this player is immediately placed into the square that the opposition player vacated."
      ),
      skill(
        "sneaky-git",
        "Sneaky Git",
        "active",
        "This player is not Sent-off when performing a Foul Action if a natural double is rolled for the Armour Roll, so long as the target player's Armour is not broken. If the target player's Armour is broken, this player will still be Sent off as normal."
      ),
      skill(
        "violent-innovator",
        "Violent Innovator",
        "active",
        "If an opposition player suffers a Casualty as a result of a Special Action this player performs, this player will earn Star Player Points for causing a Casualty as appropriate. A player can only have this Skill if they have a Trait that allows them to perform a Special Action."
      )
    ]
  },
  {
    id: "mutation",
    name: "Mutation",
    skills: [
      skill(
        "big-hand",
        "Big Hand",
        "active",
        "This player ignores all negative modifiers when attempting to pick up the ball."
      ),
      skill(
        "claws",
        "Claws",
        "passive",
        "Whenever an Armour Roll is made for an opposition player that has been Knocked Down by this player during a Block Action, even if this player is also Knocked Down, then any roll of a natural 8 or more for the Armour Roll will break the opposition player's Armour regardless of their actual Armour Value."
      ),
      skill(
        "disturbing-presence",
        "Disturbing Presence",
        "passive",
        "Any opposition player that performs a Pass Action, Throw Team-mate Action or a Throw Bomb Special Action, or attempts to Intercept or Catch the ball, applies a -1 modifier to the Passing Ability Test or Agility Test for each player on their team with this Skill within 3 squares of them."
      ),
      skill(
        "extra-arms",
        "Extra Arms",
        "active",
        "This player applies a +1 modifier to the Agility Test whenever they attempt to Catch, Pick Up or Intercept the ball."
      ),
      skill(
        "foul-appearance",
        "Foul Appearance",
        "passive",
        "Whenever an opposition player attempts to perform a Block Action against this player, or a Special Action that targets this player directly, they must roll a D6 before any other dice are rolled. On a 2+, the Block Action continues as normal. On a 1, the Block Action is immediately cancelled and the opposition player's activation immediately ends."
      ),
      skill(
        "horns",
        "Horns",
        "active",
        "Whenever this player declares a Blitz Action, then they apply a +1 modifier to their Strength Characteristic for any Block Actions performed during that Blitz Action."
      ),
      skill(
        "iron-hard-skin",
        "Iron Hard Skin",
        "passive",
        "Opposition players cannot apply any modifiers when making an Armour Roll against this player. Additionally, the Claws Skill cannot be used against this player."
      ),
      skill(
        "monstrous-mouth",
        "Monstrous Mouth",
        "active",
        "When this player is activated, they may declare a Chomp Special Action; there is no limit to the number of players that can declare this Special Action each Turn. When this player declares a Chomp Special Action, they may select one Standing opposition player they are Marking and roll a D6. On a 1-3, nothing happens. On a 4+, the opposition player is considered to be Chomped."
      ),
      skill(
        "prehensile-tail",
        "Prehensile Tail",
        "active",
        "When an opposition player attempts to Dodge, Jump or Leap away from a square in this player's Tackle Zone, they apply an additional -1 modifier to the Agility Test."
      ),
      skill(
        "tentacles",
        "Tentacles",
        "active",
        "When an opposition player attempts to Dodge, Jump or Leap away from a square in this player's Tackle Zone, this player may use this Skill. When a player uses this Skill they roll a D6 and add their Strength Characteristic to the roll; they then subtract the Strength Characteristic of the opposition player from the result. If the result is 6 or higher, or the roll is a natural 6, then the opposition player does not leave the square."
      ),
      skill(
        "two-heads",
        "Two Heads",
        "active",
        "This player may apply a +1 modifier to the Agility test whenever they attempt to Dodge."
      ),
      skill(
        "very-long-legs",
        "Very Long Legs",
        "active",
        "This player may apply a +1 modifier to the Agility test whenever they attempt to Leap or Jump, and may apply a +2 modifier to the Agility test whenever they attempt to Intercept the ball. Additionally, this player ignores the Cloud Burster Skill."
      )
    ]
  },
  {
    id: "traits",
    name: "Traits & Extraordinary",
    skills: [
      skill(
        "always-hungry",
        "Always Hungry",
        "active",
        "Whenever this player performs a Throw Team-mate Action, before making the Passing Ability Test, they must roll a D6. On a 2+, they may continue with the Throw Team-mate Action as normal. On a 1, the player will attempt to eat their team-mate."
      ),
      skill(
        "animal-savagery",
        "Animal Savagery",
        "passive",
        "Whenever this player is activated, after declaring their action they must roll a D6. They may apply a +2 modifier to the roll if they have declared a Block Action or a Blitz Action. On a 4+, the player may perform the declared action as normal. On a 1-3, this player lashes out at one of their team-mates."
      ),
      skill(
        "animosity",
        "Animosity (x)",
        "active",
        "Whenever this player attempt to perform a Pass Action or a Hand-off Action to a team-mate with the same Keyword as the one shown in brackets, roll a D6. On a 1, the player refuses to perform the action and their activation immediately ends."
      ),
      skill(
        "ball-and-chain",
        "Ball and Chain",
        "active",
        "When this player is activated, the only action they can announce is a special Ball and Chain action; there is no limit to the number of players who can announce this special action per turn."
      ),
      skill(
        "bloodlust",
        "Bloodlust (x+)",
        "passive",
        "Whenever this player is activated, after declaring their Action, they must roll a D6, adding 1 to the roll if they declared a Block Action or a Blitz Action. If they roll equal to or higher than the number shown in brackets, they may activate as normal."
      ),
      skill(
        "bombardier",
        "Bombardier",
        "active",
        "When this player is activated, they can declare a Throw Bomb Special Action; only one player can declare this Special Action each Turn."
      ),
      skill(
        "bone-head",
        "Bone Head",
        "passive",
        "Whenever this player is activated, after declaring their Action they must roll a D6. On a 2+, the player may perform the declared Action as normal. On a 1, the player becomes Distracted."
      ),
      skill(
        "breathe-fire",
        "Breathe Fire",
        "active",
        "When this player is activated, they can declare a Breathe Fire Special Action; there is no limit to the number of players that can declare this Special Action each Turn."
      ),
      skill(
        "chainsaw",
        "Chainsaw",
        "active",
        "When this player is activated, they can declare a Chainsaw Special Action; there is no limit to the number of players that can declare this Special Action each Turn."
      ),
      skill(
        "decay",
        "Decay",
        "passive",
        "Apply a +1 modifier to any Casualty Roll made for this player."
      ),
      skill(
        "drunkard",
        "Drunkard",
        "active",
        "This player applies a −1 modifier to test whenever they attempt to Rush."
      ),
      skill(
        "hatred",
        "Hatred (x)",
        "active",
        "Each time this player blocks a player with the same keyword as the one in parentheses, that player may reroll a Skull result."
      ),
      skill(
        "hypnotic-gaze",
        "Hypnotic Gaze",
        "active",
        "When this player is activated, they can declare a Hypnotic Gaze Special Action; there is no limit to the number of players that can declare this Special Action each Turn."
      ),
      skill(
        "insignificant",
        "Insignificant",
        "passive",
        "When creating a Team Draft List, you may not include more players with this Trait than players without this Trait."
      ),
      skill(
        "kick-team-mate",
        "Kick Team-mate",
        "active",
        "Once per team turn, in addition to another player performing either a Pass or a Throw Team-mate action, a single player with this Trait on the active team can perform a 'Kick Team-mate' Special action."
      ),
      skill(
        "loner",
        "Loner (x+)",
        "passive",
        "Whenever this player wishes to use a Team Re-roll, they must roll a D6. If they roll equal to or higher than the number shown in brackets, then they may use the Team Re-roll as normal. If they roll lower than the number shown in brackets, then they may not re-roll the dice and the Team Re-roll is lost just as if it had been used."
      ),
      skill(
        "my-ball",
        "My Ball",
        "passive",
        "This player with this Trait may not willingly give up the ball when in possession of it, and so may not declare Pass Actions, Hand-off Actions, or use any other Skill or Trait that would allow them to relinquish possession of the ball."
      ),
      skill(
        "no-ball",
        "No Ball",
        "passive",
        "A player with this Trait may never have possession of the ball. If this player would be required to attempt to Catch or Pick-up the ball, they will automatically fail to do so as if they had rolled a natural 1."
      ),
      skill(
        "pick-me-up",
        "Pick-me-up",
        "active",
        "At the end of each of the opposition's Turns, roll a D6 for each Prone team-mate within 3 squares of one or more Standing players with this Trait. On a 5+, the Prone player with this Trait may immediately Stand up."
      ),
      skill(
        "plague-ridden",
        "Plague Ridden",
        "passive",
        "Once per game, when a player with this Trait causes a Casualty against an opposition player as a result of a Block Action, and that player suffers a Dead result on their Casualty Roll and is not saved by an Apothecary, you may immediately add one new Lineman player from your team's Team Roster to your Reserves Box."
      ),
      skill(
        "pogo-stick",
        "Pogo Stick",
        "active",
        "During their movement, a player with this Trait can attempt to Pogo over a single adjacent square regardless of what is in the square. Pogoing works the same way as Jumping, with the exception that the Pogoing player may ignore all negative modifiers they would receive by Jumping. A player with this Trait cannot also have the Leap Skill."
      ),
      skill(
        "projectile-vomit",
        "Projectile Vomit",
        "active",
        "When this player is activated, they can declare a Projectile Vomit Special Action; there is no limit to the number of players that can declare this Special Action each Turn."
      ),
      skill(
        "really-stupid",
        "Really Stupid",
        "passive",
        "Whenever this player is activated, after declaring their Action, they must roll a D6. They may apply a +1 modifier to the roll if they have any Standing team-mates who are not Distracted, and do not have the Really Stupid Trait, adjacent to them. On a 4+, the player may perform the declared Action as normal. On a 1-3, this player becomes Distracted."
      ),
      skill(
        "regeneration",
        "Regeneration",
        "passive",
        "Whenever this player suffers a Casualty, before making the Casualty Roll for them, roll a D6. On a 1-3, this player suffers the Casualty as normal. On a 4+, this player Regenerates and ignores the Casualty and is instead placed in their team's Reserves Box."
      ),
      skill(
        "right-stuff",
        "Right Stuff",
        "passive",
        "This player can be thrown by a team-mate with the Throw Team-mate Trait, even if this player is Prone."
      ),
      skill(
        "secret-weapon",
        "Secret Weapon",
        "passive",
        "At the end of a Drive in which this player took part, even if they are not on the pitch at the end of the Drive, they are Sent-off for committing a Foul."
      ),
      skill(
        "stab",
        "Stab",
        "active",
        "When this player is activated, they can declare a Stab Special Action; there is no limit to the number of players that can declare this Special Action each Turn."
      ),
      skill(
        "stunty",
        "Stunty",
        "passive",
        "When this player attempts to Dodge, they do not suffer any negative modifiers to their Agility Test for being Marked by opposition players. Additionally, this player applies a -1 modifier to the Agility Test when attempting to Intercept the ball. A player with this Trait is more prone to injury and so if an Injury Roll is made for them, roll on the Stunty Injury Table instead."
      ),
      skill(
        "swoop",
        "Swoop",
        "passive",
        "When this player is thrown by a Throw Team-mate Action, they may choose not to Scatter before landing as normal."
      ),
      skill(
        "take-root",
        "Take Root",
        "passive",
        "Whenever this player is activated, after declaring their Action, if they are Standing they must roll a D6. On a 2+, the player may perform the declared Action as normal. On a 1, the player becomes Rooted."
      ),
      skill(
        "throw-team-mate",
        "Throw Team-mate",
        "passive",
        "This player may declare the Throw Team-mate Action."
      ),
      skill(
        "timmm-ber",
        "Timmm-ber!",
        "passive",
        "If this player has an MA of 2 or less and attempts to stand up, apply a +1 modifier to the roll for standing up for each Open Standing team-mate adjacent to this player."
      ),
      skill(
        "titchy",
        "Titchy",
        "passive",
        "A player with this Trait can apply a +1 modifier to the Agility test when attempting to dodge. However, when an opposing player attempts to dodge into a square within this player's tackle zone, this player does not apply the -1 modifier to the opposing player's Agility test."
      ),
      skill(
        "trickster",
        "Trickster",
        "active",
        "Whenever an opposition player attempts to perform a Block Action against this player, or a Special Action that targets this player directly, this player may use this Trait. Before determining how many dice are rolled, this player may be removed from the pitch and placed in any other unoccupied square adjacent to the player performing the Action."
      ),
      skill(
        "unchannelled-fury",
        "Unchannelled Fury",
        "passive",
        "Whenever this player is activated, after declaring their Action, they must roll a D6. They may apply a +2 modifier to the roll if they have declared a Block Action or a Blitz Action. On a 4+, the player may perform the declared Action as normal. On a 1-3, this player rages incoherently but nothing really happens. Their activation immediately ends."
      ),
      skill(
        "unsteady",
        "Unsteady",
        "passive",
        "This player may not declare Secure the Ball Actions."
      )
    ]
  }
];
