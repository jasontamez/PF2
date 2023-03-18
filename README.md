# TO-DO

* equipment/vehicles need to be parsed
* class files needing parsing:
  * alchemist (?)
  * arcanist exploits (?)
  * ~~barbarian and UC rage powers~~
  * ~~_bard masterpieces, advanced versatile performances~~
  * ~~bloodrager bloodlines~~
  * cavalier orders, banners
  * cleric domains, variant channeling
  * druid companions, domains, herbalism
  * _EIDOLON and UC base forms
  * fighter weapon groups (?)
  * gunslinger dares and deeds
  * hunter animal focus
  * inquisitions
  * investigator talents, annointments
  * kineticist talents, elements
  * magus acana (?)
  * mesmerist stares, tricks
  * medium spririts
  * monk and UC ki powers, vows, style strikes
  * ninja tricks
  * occultist implements
  * oracle mysteries, curses
  * paladin oaths, divine bonds, mercies
  * psychic phrenic amps, disciplines
  * ranger combat styles
  * rogue and UC talents, skill unlocks
  * shaman hexes, spirits
  * shifter aspects
  * skald sagas, rage powers (barb), advanced versatile performances (bard)
  * slayer talents
  * sorcerer bloodlines, wildbloods
  * summoner and UC evolutions
  * swashbuckler deeds
  * vigilante talents
  * warpriest blessings
  * witch unique patrons
  * wizard arcane discoveries, familiars, schools
  * PHANTOM focuses
* Archetypes (under classes)
* Races
* Rules
* Universal Monster Rules (umr)

---

## Semi-Important

* advanced armor training (dir)
* advanced weapon training (dir)
* spell definitions
* SUMMON lists
* bloodline mutations?
* special materials
* mythic paths
* path abilities
* sources (?) (dir)

---

## Less Important

* prestige classes, including hellknight stuff (many)
* diseases (many)
* curses (many)
* drugs (many)
* poisons (many)
* shadow piercings
* spellbooks (many)
* wards
* traps (many)
* fungal grafts
* alchemical reagents
* elemental augmentations
* necrografts
* psitech?
* construct mods (many)
* haunts (many)
* madnesses (many)
* NPCs (so many!)
* occult rituals

## Code

    return input
        .replace(/<a href="spelldisplay.+?>(.+?)<\/a>/g, `[$1](spell:$1)`)
        .replace(/<a href="deitydisplay.+?>(.+?)<\/a>/g, `[$1](deity:$1)`)
        .replace(/<a href="featdisplay.+?>(.+?)<\/a>/g, `[$1](feat:$1)`)
        .replace(/<a href="traitdisplay.+?>(.+?)<\/a>/g, `[$1](trait:$1)`)
        .replace(/<a href="monsterdisplay.+?>(.+?)<\/a>/g, `[$1](monster:$1)`)
        .replace(/<a href="classdisplay.+?>(.+?)<\/a>/g, `[$1](class:$1)`)
        .replace(/<a .+?>(.+?)<\/a>/g, `[$1](unknown:$1)`);
