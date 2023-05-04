# Formatting so far

## Flags

### `basic:`

A creature without one of these tags does not perform that basic function.

- `eats`
- `sleeps`
- `breathes`
- `ages`

Other tags can indicate special properties.

- `low-light-vision`
- `scent`
- `see-in-darkness`
- `no-unconscious`
    - The creature can't go unconscious and is destroyed at 0 hit points
- `no-constitution`
- `blind`
    - The creature is immune to gaze attacks and the like

---

### `immune:`

- `ability-damage` - immune to all ability damage; specific stats can be immune, too
    - `constitution-damage`
    - `dexterity-damage`
    - `strength-damage`
- `ability-drain`
- `aging`
- `bleed`
- `critical-hits`
- `curses`
- `death-effects`
- `death-massive-damage` - immune to death from massive damage
- `disease`
- `divination`
- `energy-drain`
- `exhaustion`
- `fatigue`
- `fear` - fear effects
- `flanking`
- `fortitude-saves` - immune to anything requiring a Fortitude save, unless it can affect objects and/or is harmless
- `mind-affecting`
- `necromancy` - school of magic, necromancy effects
- `immune:negative-levels`
- `nonlethal`
- `paralysis`
- `permanent-wounds`
- `poison`
- `polymorph`
- `precision-damage` - immune to sneak attack, etc
- `sleep` - immune to magic sleep effects
- `stun`
- specific combat maneuvers:
    - `bull-rush`
    - `grapple`
    - `trip`

### Others

- `creature-type:` - "undead", "humanoid", etc
- `creature-subtype:` - "fire", "good", "orc", "human", etc
- `alignment:` - "LG", "N", "CE", etc
- `language:` - "draconic", "celestial", "dwarven", etc
- `vulnerable:` - "fire", "cold", "critical-hits", etc
- `class-skill:` - "acrobatics", "perception", "stealth", etc
- `group:` - Ethnicity, subspecies, affiliations, and other groupings

---

## Scores

-*Format**: Purpose: category / sample name properties / base tag / subtags

### Simple

- `INTEGER`
    - Resistances: resistance / electricity|fire|etc / resistance / electricity|:fire|etc
    - Speeds: speed / base|fly|swim|burrow|etc / speed / base|:fly|:swim|etc
    - Senses: sense / darkvision|tremorsense|etc / sense /

## Features

- By Category
    - `feat`
    - `trait`
    - `species` - replaces "race" and "monster"
