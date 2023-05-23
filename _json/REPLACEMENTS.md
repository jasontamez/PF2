<!-- markdownlint-disable MD038 -->
# A record for myself

Replace feats with single focus
`^(\t+)\{\n\1\t"(feat)": "(.+?)",\n\1\t"focus": "(.+?)"\n\1\}`
`$1"hasFeatureInCategoryTagged([$2],[focus:\L$4],$3)"`

`(focus:.*?) (.*?\])`
`$1-$2`

Replace feats with multiple possible foci
`^(\t+)(\{\n\1\t"(feat)": "(.+?)",\n\1\t"focus": \[\n(?:\1\t\t".+?",\n)*\1\t\t")(?!focus)(.+?")`
`$1$2focus:\L$5`

`focus:([^()"]+)[()]`
`focus:$1`

`"focus:([^ "]+) `
`"focus:$1-`

`(?<=")(focus:.+?)",\n\t+"`
`$1,`

`^(\t+)\{\n\1\t"(feat)": "(.+?)",\n\1\t"focus": \[\n\1\t\t"(.+?)"\n\1\t\]\n\1\}`
`$1"hasFeatureInCategoryTagged([$2],[$4],$3)"`

Replace multiple-feats requirements

`^(\t+)("feat_all": \[\n(?:\1\t".+?",\n)*\1\t".+?)",\n\1\t"(.+?)"\n`
`$1$2,$3"\n`

`^(\t+)\{\n\1\t"(feat)_any": \[\n\1\t\t"(.+?)"\n\1\t\]\n\1\}`
`$1"hasFeatureAllInCategory([$2],$3)"`

`^(\t+)(\{\n(?:\1\t.+\n)*)\1\t"(feat)_all": \[\n\1\t\t"(.+?)"\n\1\t\],?\n((?:\1\t.+\n)*\1\})`
`$1"hasFeatureAllInCategory([$3],$4)",\n$1$2$5`

`,(\n\t+\})`
`$1`

Condense feats with multiple possibilities

`^(\t+)("feat_any": \[\n(?:\1\t".+?",\n)*\1\t".+?)",\n\1\t"(.+?)"\n`
`$1$2,$3"\n`

`^(\t+)"(feat)_any": \[\n\1\t(".+?")\n\1\]`
`$1"$2": $3`

Replace feats without foci
`^(\t+)\{\n\1\t"(feat)": "(.+?)"\n\1\}`
`$1"hasFeatureInCategory([$2],$3)"`

`^(\t+)(\{\n(?:\1\t.+\n)*?)\1\t"(feat)": "(.+?)",?\n((?:\1\t.+\n)*\1\})`
`$1"hasFeatureInCategory([$3],$4)",\n$1$2$5`

`,(\n\t+\})`
`$1`

Replace att/char level scores
`^(\t+)\{\n\1\t"(character|strength|dexterity|constitution|intelligence|wisdom|charisma)_(score|level)": ([0-9])\n\1\}`
`$1"getScore($2 $3) >= $4"`

`^(\t+)\{\n\1\t"(character|strength|dexterity|constitution|intelligence|wisdom|charisma)_(score|level)_exact": ([0-9])\n\1\}`
`$1"getScore($2 $3) == $4"`

`^(\t+)(\{\n(?:\1\t.+\n)*?)\1\t"(character|strength|dexterity|constitution|intelligence|wisdom|charisma)_(score|level)": ([0-9]+),?\n((?:\1\t.+\n)*\1\})`
`$1"getScore($3 $4) >= $5",\n$1$2$6`

`^(\t+)(\{\n(?:\1\t.+\n)*?)\1\t"(character|strength|dexterity|constitution|intelligence|wisdom|charisma)_(score|level)_exact": ([0-9]+),?\n((?:\1\t.+\n)*\1\})`
`$1"getScore($3 $4) == $5",\n$1$2$6`

`,(\n\t+\})`
`$1`

Replace other integer scores
`^(\t+)\{\n\1\t"(base_attack_bonus|base_[^_"]+_save_bonus|legs|[^"]+_d[0-9]+|darkvision|dr|age|fighter_bravery_bonus|trap_sense_bonus|arms|hit_dice)": ([0-9]+)\n\1\}`
`$1"getScore($2) >= $3"`

`^(\t+)\{\n\1\t"(base_attack_bonus|base_[^_"]+_save_bonus|legs|[^"]+_d[0-9]+|darkvision|dr|age|fighter_bravery_bonus|trap_sense_bonus|arms|hit_dice)_exact": ([0-9]+)\n\1\}`
`$1"getScore($2) == $3"`

`^(\t+)(\{\n(?:\1\t.+\n)*?)\1\t"(base_attack_bonus|base_[^_"]+_save_bonus|legs|[^"]+_d[0-9]+|darkvision|dr|age|fighter_bravery_bonus|trap_sense_bonus|arms|hit_dice)": ([0-9]+),?\n((?:\1\t.+\n)*\1\})`
`$1"getScore($3) >= $4",\n$1$2$5`

`^(\t+)(\{\n(?:\1\t.+\n)*?)\1\t"(base_attack_bonus|base_[^_"]+_save_bonus|legs|[^"]+_d[0-9]+|darkvision|dr|age|fighter_bravery_bonus|trap_sense_bonus|arms|hit_dice)_exact": ([0-9]+),?\n((?:\1\t.+\n)*\1\})`
`$1"getScore($3) == $4",\n$1$2$5`

`(getScore\([^)]+)_`
`$1 `

`,(\n\t+\})`
`$1`

Replace class/level combos

`^(\t+)\{\n\1\t"class": "(.+?)",\n\1\t"level": ([0-9]+)\n\1\}`
`$1"getScore($2 class level) >= $3"`

Replace skill-rank checks

`(\t+)\{\n\1\t"skill": \[\n\1\t\t"(.+?)",\n\1\t\t([0-9]+)\n\1\t\]\n\1\}`
`$1"getInput(\L$2 ranks) >= $3"`

`^(\t+)(\{\n(?:\1\t.+\n)*?)\1\t"skill": \[\n\1\t\t"(.+?)",\n\1\t\t([0-9]+)\n\1\t\],?\n((?:\1\t.+\n)*\1\})`
`$1"getInput(\L$3 ranks) >= $4",\n$1$2$5`

`,(\n\t+\})`
`$1`

`(getInput\([^)]+\([^) ]+) (\) ranks\))`
`$1-$2`

`(getInput\([^)]+) \(([^)]+)\)( ranks\))`
`$1-$2$3`

Condense class features with multiple possibilities

`^(\t+)("god_any": \[\n(?:\1\t".+?",\n)*\1\t".+?)",\n\1\t"(.+?)"\n`
`$1$2,$3"\n`

`^(\t+)"(god)_any": \[\n\1\t(".+?")\n\1\]`
`$1"$2": $3`

Replace class features
`^(\t+)\{\n\1\t"creature": "(.+?)"\n\1\}`
`$1"hasFeatureInCategory((god),$2)"`

`^(\t+)(\{\n(?:\1\t.+\n)*?)\1\t"deity": "(.+?)",?\n((?:\1\t.+\n)*\1\})`
`$1"hasFeatureInCategory((god),$3)",\n$1$2$4`

`^(\t+)\{\n\1\t"class_feature_all": "(.+?)"\n\1\}`
`$1"hasFeatureAllInCategory([class feature],$2)"`

`^(\t+)(\{\n(?:\1\t.+\n)*?)\1\t"class_feature_all": "(.+?)",?\n((?:\1\t.+\n)*\1\})`
`$1"hasFeatureAllInCategory([class feature],$3)",\n$1$2$4`

`^(\t+)\{\n\1\t"alignment": "(.+?)"\n\1\}`
`$1"getInput(alignment)==$2"`

`^(\t+)(\{\n(?:\1\t.+\n)*?)\1\t"alignment": "(.+?)",?\n((?:\1\t.+\n)*\1\})`
`$1"getInput(alignment)==$3",\n$1$2$4`


`,(\n\t+\})`
`$1`

Alignment

`^(\t+)\{\n\1\t"alignment_": "(.+?)"\n\1\}`
`$1"getInput(alignment_)==$2"`

`^(\t+)(\{\n(?:\1\t.+\n)*?)\1\t"alignment_": "(.+?)",?\n((?:\1\t.+\n)*\1\})`
`$1"getInput(alignment_)==$3",\n$1$2$4`
