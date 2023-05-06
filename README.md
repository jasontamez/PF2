# Plan?

System should specify sheets and all relevant JSON files. The sheet should describe what it needs and at least two output formats, one for printing, one for generating and updating. The latter one should only show what is currently fillable (?) and have some help text for what is needed.

## TO-DO

- Trait CREATURES, UNFINISHED, etc

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

### `ShorthandLookupObject`

An object with properties describing certain non-standard lookups that may be used; one of the properties below is generally required:

```javascript
{
  "lookup1": {
    "_value": ANY, // A lookup property; when the shorthand is called, it's value will be mapped to that property
    "_value_suffix": STRING, // As above, but the shorthand's value is appended to the end of the given property; if an Array is given, the value is appended to every element of that Array
    "_value_prefix": STRING, // Aa above, but the shorthand's value is prepended instead of appended
    "_value_map": ARRAY_ANY // An Array of lookup properties; when the shorthand is called, it will map the incoming array to the listed properties in order
    // (other lookup properties should be included; they will be included in the lookup whenever this shorthand is used)
  }
}
```

Example:

```json
{
  "feat": {
    "_value": "name",
    "query": "feature",
    "category": "feat"
  },
  "creature": {
    "_value_suffix": "has_tag",
    "query": "flag",
    "has_tag": "species:"
  },
  "creature_any": {
    "_value_prefix": "has_tag_any",
    "query": "flag",
    "has_tag_any": ":PC"
  }
}
```

So this:

```json
{
  "feat": "Fancy!",
  "creature": "borg",
  "creature_any": [
    "human",
    "ferengi"
  ]
}
```

Becomes equal to these `LookupObjects`:

```json
{
  "query": "feature",
  "category": "feat",
  "name": "Fancy!"
},
{
  "query": "flag",
  "has_tag": "species:borg"
},
{
  "query": "flag",
  "has_tag_any": [
    "human:PC",
    "ferengi:PC"
  ]
}
```

---

## Terms

### Basic `Values`

### `"input"`

A `STRING`, `NUMBER` or `INTEGER` submitted by the end user

#### `"feature"`

An Object that describes some sort of interaction

#### `"bonus"`

A `NUMBER` or `INTEGER` that can be assigned to multiple things

#### `"flag"`

A static value that can be assigned to multiple things

#### `"score"`

An object that collects `inputs`, `bonuses` and/or `flags` and returns a value, usually an `INTEGER` or `NUMBER`

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

#### `"lookup_shorthands": ARRAY_ShorthandLookupObject`

An object declaring all shorthand lookup properties the `Values` may use

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
- 2001-3000 - Foundational Feats
- 3001-4000 - Midrange Feats
- 4001-5000 - Highest-level Feats

---

### Lookups

- **Global properties**
  - `"query": ENUM "feature", "score", "flag", "bonus"` - The type of `Value` we're looking for
  - `"find": LookupObject` - A generic "wrapper", to combine a Lookup with other operations (e.g. `"quantity"` below)
  - `"find_any": ARRAY_LookupObject` - As above, but only one included `LookupObject` needs to match
  - `"find_all": ARRAY_LookupObject` - As above, but **all** included `LookupObjects` need to match
  - `"name": STRING` - Looking for something with the specific name
  - `"name_any": ARRAY_STRING` - Looking for any of the listed names
  - `"name_all": ARRAY_STRING` - Looking for **all** of the listed names
  - `"name_match": STRING` - Looking for something that matches the given regular expression
  - `"has_type": STRING` - Looking for something that has the listed type
  - `"has_type_any": ARRAY_STRING` - Looking for something that has any of the listed types
  - `"has_type_all": ARRAY_STRING` - Looking for something that has **all** of the listed types
  - `"has_tag": STRING` - Looking for something that has the listed tag
  - `"has_tag_any": ARRAY_STRING` - Looking for something that has any of the listed tags
  - `"has_tag_all": ARRAY_STRING` - Looking for something that has **all** of the listed tags
  - `"has_tag_type": STRING` - Looking for something that has a tag with the listed prefix
  - `"quantity": INTEGER` - Looking for at least the indicated number of separate things

- **Feature properties**
  - `"category": STRING` - Looking for an ability with the listed category
  - `"category_any": ARRAY_STRING` - Looking for an ability with any of the the listed categories

- **Score properties**
  - `"minimum": NUMBER` - Looking for a value equal to or greater than the given number
  - `"maximum": NUMBER` - Looking for a value equal to or less than the given number
  - `"exact": NUMBER` - Looking for a value equal to the given number
  - `"exact_any": ARRAY_NUMBER` - Looking for a value equal to any of the given numbers

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
  - kineticist ~~talents~~, elements
  - ~~magus acana (?)~~
  - mesmerist stares, tricks
  - ~~medium spririts - reformat~~
  - ~~monk and UC ki powers, vows, style strikes~~
  - ~~ninja tricks~~
  - occultist implements
  - oracle mysteries, ~~curses~~
  - paladin oaths, divine bonds, mercies
  - psychic phrenic amps, disciplines
  - ~~ranger combat styles~~
  - ~~rogue and UC talents, skill unlocks~~
  - ~~samurai~~
  - shaman hexes, spirits
  - shifter aspects
  - skald ~~sagas, rage powers (barb), masterpieces,~~ advanced versatile performances (bard)
  - ~~slayer talents~~
  - sorcerer bloodlines, wildbloods
  - summoner and UC evolutions
  - ~~swashbuckler deeds~~
  - ~~vigilante talents~~
  - ~~warpriest blessings~~
  - witch hexes, patrons, unique patrons
  - wizard ~~arcane discoveries, familiars,~~ schools
  - PHANTOM focuses
- Archetypes (under classes)
- Races
- Rules
- Universal Monster Rules (umr)

---

## Semi-Important

- advanced armor training (dir)
- advanced weapon training (dir)
- spell definitions
- SUMMON lists
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
