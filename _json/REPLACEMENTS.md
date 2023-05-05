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
