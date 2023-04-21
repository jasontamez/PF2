# Formatting so far

## Flags

### These should be obvious

* creature-type:outsider
* creature-subtype:native
* immune:poison
  * petrification, critical-hits, precision-damage, flanking, stun, sleep, stun, paralysis, bleed, mind-affecting, disease, death-effects, death-massive-damage, fortitude-saves (immune to anything requiring a Fortitude save, unless it can affect objects and/or is harmless), nonlethal, ability-drain, ability-damage (you can also specify only certain types of damage, like constitution-damage or strength-damage), energy-drain, exhaustion, fatigue, polymorph
* language:draconic

### Basics

A creature without one of these tags does not perform that basic function.

* basic:eats
* basic:sleeps
* basic:breathes

Other tags can indicate special properties.

* basic:no-unconscious
  * The creature can't go unconscious and is destroyed at 0 hit points
* basic:no-constitution
* basic:blind
  * The creature is immune to gaze attacks and the like

---

### Senses

* sense:low-light-vision

---

## Scores

### Format

* Purpose: name property / value property type / tags, ...

### Simple

* Resistances: electricity / `INTEGER` / resistance

## Abilities
