# Plan?

System should specify sheets and all relevant JSON files. The sheet should describe what it needs and at least two output formats, one for printing, one for generating and updating. The latter one should only show what is currently fillable (?) and have some help text for what is needed.

## TO-DO

- Trait CREATURES, UNFINISHED, etc
- classes: Wizard: improved familiars: celestial, fiendish, entropic (protean?), resolute templates
- **Remove input/score/bonus distinction and just use typed scores**

- Remove **commas** from all names.

## How to add classes?

- Needs to add level by level
- Maybe have a class levels `input` for every class?

## Types

### `KEYS`

Array of unique plain text values, no duplicates

### `ARRAY_`

prefix, turns any of the below into an Array

### `STRING`

plain text

### `MARKDOWN`

Markdown text string

### `BOOLEAN`

true or false

### `NUMBER`

any number

### `INTEGER`

any whole number

### `FormatObject`

An object with properties declaring how certain properties are formatted:

```javascript
{
  "STRING": [         // these properties will be strings
    "prop1",
    "prop3"
  ],
  "BOOLEAN": [        // these properties will be booleans
    "prop4"
  ],
  "ARRAY_STRING": [   // these properties will be arrays of strings
    "prop2"
    "prop3"           // A property may have multiple possible types!
  ]
}
```

### `LookupObject`

An object designed to be used as a query that returns either true or false; see the **Lookups** section below

---

## Terms

### Basic `Values`

### `"input"`

An object that returns a `STRING`, `NUMBER` or `INTEGER`; usually, this value can be changed directly by the end user; its value is not necessarily dependant on other values

#### `"info"`

An Object that offers information to the end user

#### `"feature"`

An Object that describes some sort of interaction

#### `"score"`

An object that returns a value, usually an `INTEGER` or `NUMBER`; this differs from an `input` in that its value is entirely dependant on other `Values`

---

### Basic properties of `JSON`

#### `"category": STRING`

A label for the entire class of `Value` this `JSON` provides

#### `"list": ARRAY_Values`

The `Values` this JSON provides

#### `"standard_properties": ARRAY_STRING`

An array of optional, standard properties the `Values` have

#### `"searchable_properties": FormatObject`

An object declaring any searchable, non-standard properties the `Values` may have

#### `"shared_properties": ARRAY_variable`

An object containing properties, all of which should be considered to be part of every `Value` in the `"list"` Array.

---

### Basic properties of `Values`

#### `"name": STRING`

The label of the `Value`

#### `"tags": KEYS`

A list of "tags" associated with this `Value`, hidden from end-user

- `tags` should be in the format `"prefix:specific"`, e.g. "skill:craft" or "creature-type:half-orc"

#### `"types": KEYS`

A list of "types" associated with this `Value`, most likely visible to end-user

#### `"order": Object`

The properties of this object correspond to `bestow_` and `remove_` properties of the `Value`; each property resolves to an `INTEGER` that describes when they should be executed, starting with the lowest number

-Example:*

```json
"order": {
  "removes_tags": 100,
  "bestows_tags": 101
}
```

There should be a general list of numbers where certain `features` should be placed.

- 0-1000 - Ancestry
- 1001-2000 - Class
- 2001-3000 - Traits, Foundational Feats
- 3001-4000 - Midrange Feats
- 4001-5000 - Highest-level Feats

---

## Bestow tags?

- `"bestow_tag": STRING`
- `"bestow_tags": ARRAY_STRING`
- `"bestow_type": STRING`
- `"bestow_types": ARRAY_STRING`

Each `bestow_` property has a corresponding `remove_` property

---

## More To-Do

- "variant channeling"?
- equipment/vehicles need to be parsed
- ~~DIVINE FIGHTING TECHNIQUES~~
- Feat formatting pass three
  - ~~SPELL~~
  - ~~GODS~~
  - SELECTED
  - UNKN?OWN
  - ~~FAMILIAR~~
  - ~~AFFINITY~~
- Note places where we can clean up duplicates, like `class_feature` and `special_ability`, maybe
- Feat formatting pass four: adding the things the feats GIVE, somehow
- class files needing parsing:
  - ~~alchemist (?)~~
  - ~~arcanist exploits (?)~~
  - ~~barbarian and UC rage powers~~
  - ~~_bard masterpieces, advanced versatile performances~~
  - ~~bloodrager bloodlines~~
  - ~~cavalier orders, banners~~
  - ~~cleric domains, variant channeling~~
  - ~~druid companions, domains, herbalism~~
  - _EIDOLON and UC base forms
  - ~~fighter weapon groups (?)~~
  - ~~gunslinger dares and deeds~~
  - ~~hunter animal focus~~
  - ~~inquisitions~~
  - ~~investigator talents, annointments~~
  - ~~kineticist talents, elements~~
  - ~~magus acana (?)~~
  - ~~mesmerist stares, tricks~~
  - ~~medium spririts - reformat~~
  - ~~monk and UC ki powers, vows, style strikes~~
  - ~~ninja tricks~~
  - ~~occultist implements~~
  - ~~oracle mysteries, curses~~
  - ~~paladin oaths, divine bonds, mercies~~
  - ~~psychic phrenic amps, disciplines~~
  - ~~ranger combat styles~~
  - ~~rogue and UC talents, skill unlocks~~
  - ~~samurai~~
  - ~~shaman hexes, spirits~~
  - ~~shifter aspects~~
  - skald ~~sagas, rage powers (barb), masterpieces,~~ advanced versatile performances (bard)
  - ~~slayer talents~~
  - ~~sorcerer bloodlines, wildbloods~~
  - summoner and UC evolutions
  - ~~swashbuckler deeds~~
  - ~~vigilante talents~~
  - ~~warpriest blessings~~
  - ~~witch hexes, patrons, unique patrons~~
  - wizard ~~arcane discoveries, familiars,~~ schools
  - PHANTOM focuses
- Archetypes (under classes)
- Races
- ~~Rules~~
- Universal Monster Rules (umr)

---

## Semi-Important

- advanced armor training (dir)
- advanced weapon training (dir)
- spell definitions
- bloodline mutations?
- special materials
- mythic paths
- path abilities
- sources (?) (dir)

---

## Less Important

- prestige classes, including hellknight stuff (many)
- diseases (many)
- curses (many)
- drugs (many)
- poisons (many)
- shadow piercings
- spellbooks (many)
- wards
- traps (many)
- fungal grafts
- alchemical reagents
- elemental augmentations
- necrografts
- psitech?
- construct mods (many)
- haunts (many)
- madnesses (many)
- NPCs (so many!)
- occult rituals

## NOTES

Focus feats should bestow themselves with tags such as focus:name-of-weapon and focus-type:favored-weapon, focus-type:bludgeoning, focus-type:natural, etc

## Code

```javascript
return input
  .replace(/<a href="spelldisplay.+?>(.+?)<\/a>/g, `[$1](spell:$1)`)
  .replace(/<a href="deitydisplay.+?>(.+?)<\/a>/g, `[$1](deity:$1)`)
  .replace(/<a href="featdisplay.+?>(.+?)<\/a>/g, `[$1](feat:$1)`)
  .replace(/<a href="traitdisplay.+?>(.+?)<\/a>/g, `[$1](trait:$1)`)
  .replace(/<a href="monsterdisplay.+?>(.+?)<\/a>/g, `[$1](monster:$1)`)
  .replace(/<a href="classdisplay.+?>(.+?)<\/a>/g, `[$1](class:$1)`)
  .replace(/<a .+?>(.+?)<\/a>/g, `[$1](unknown:$1)`);
```
