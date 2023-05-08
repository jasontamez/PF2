# Math

These are default functions. More can be added as a part of different rule systems. For example, Pathfinder should have a special function to handle how bonuses stack by type.

## Whitespace

These should be ignored:

- Any spaces around mathematical symbols
- Spaces around parentheses, even in functions
- Spaces *following* a comma in a function

Quotation marks are an exception, they surround a string which should not be mutated in any way

```javascript
"save(  X, whatever )" // saves "whatever" under the name "X"
"save(\"  Y\",\" and, a day\")" // saves " and, a day" under the name "  Y"
```

## Quotation Marks

`STRINGS` need not be enclosed in quotes in functions, unless

1. the `STRING` is in a function that could accept arguments other than `STRINGS`
2. the `STRING` includes brackets, commas, parentheses, quotation marks, math and logical operators, or other reserved characters
    - `[],"()|&!><=>%+-/*`

- `function(hello)` is equal to `function("hello")`
- `function([one,two,three,four])` is equal to `function(["one","two","three","four"])`

## String Format

### Order of operations

- These should respect the standard "PEDMAS" order of operations, with some additions. (This is also basically the same order used in Javascript.)

1. Strings surrounded by quotation marks `" "` are noted
2. Parentheses `()`
  1. Whitespace around parentheses is discarded
  2. Innermost parentheses are evaluated before outer, from left to right
3. Functions `function()`
  1. Whitespace in functions is discarded
  2. Innermost functions are evaluated before outer, from left to right
4. All remaining whitespace is discarded
5. Negation `!`
6. Exponents `**`
7. Division, Multiplication, and Remainders `/ * %`
8. Addition and Subtraction `+ -`
9. Comparisons `< <= > >=`
10. Equalities `== !=`
11. Logical AND `&&`
12. Logical OR `||`

### General Functions

- `save(STRING,x)` - saves the value x as `STRING` for later use
  - It also returns the saved value
  - `save(X,5)+2` = 7 (and also saves 'X' with a value 5)
- `load(STRING)` - returns the value previously saved as `STRING`

### Getters and Setters

- `getScore(STRING)` - gets the current value of the `score` with the given name
- `getBonus(STRING)` - gets the current value of the `bonus` with the given name
- `getInput(STRING)` - gets the current value of the `input` with the given name
- `setInput(STRING, Value)` - sets the `input` with the given name to the given `Value`
  - If more than one `score`, `bonus` or `input` shares the same name, any of them might be get or set

### Numeric Operations

- Most mathematical symbols work as expected
  - `+` addition
  - `-` subtraction
  - `*` multiplication
  - `/` division
  - `x % y` divides "x" by "y" and only returns the "remainder"
    - `10 % 7` = 3
    - `10 % 5` = 0
    - `10 % 35` = 10
  - `x ** y` raises "x" to the power of "y"
  - Parentheses work as expected
    - `1 + 2 * 5` = 11
    - `(1 + 2) * 5` = 15

- Some special functions exist
  - `squareRoot(x)` gives the square root of x
  - `round(x)` rounds x to the nearest integer (0.5 will round up)
  - `ceil(x)` rounds up to the next highest integer
    - `ceil(5.0002)` = 6
    - `ceil(-1.8)` = -1 *negative numbers may give non-intuitive results!*
  - `floor(x)` rounds down to the next lowest integer
    - `floor(34.99999)` = 34
    - `floor(-5.2)` = -6 *negative numbers may give non-intuitive results!*
  - `randomInt(x,y)` gives a random integer between x and y, inclusive of both
  - `randomInt(x)` gives a random integer between 0 and x, inclusive of both
  - `random(x)` gives a random number between 0 and x, inclusive of 0 and excluding x
  - `min(x,y,z)` returns the smallest number among x, y, and z
  - `max(x,y,z)` returns the highest number among x, y, and z
    - Both `min` and `max` can take any number of arguments
      - `min(1)` = 1
      - `max(56,30)` = 56
      - `max(45,20,10**2,17,500/10)` = 100 (10**2)

### Boolean Operations

- Most logical operators work as expected
  - `6 > 4` true
  - `7 >= 4 + 3` true
  - `5 < 8` true
  - `squareRoot(16) <= 4` true
  - `78 == 56 + 22` true
  - `45 != 32` true
- Plain values are considered true if they are not equal to zero, the empty string, "false", "null", or other typical 'falsy' values
  - `45` true
  - `-4` true
  - `57 * 0` false
  - `""` false (empty string)
  - `false` false
  - `FalSe` true (case sensitivity)
- Logical comparisons include *and* and *or*
  - `45 & 0` false
  - `65 & (2-3)` true
  - `45 || 0` true
  - `false ||` false (empty string is false)
- Putting an exclamation point before something inverts its boolean value
  - `!0` true
  - `!false` true
  - `!FalSe` false
- Functions can be used to find portions of other `STRINGS`
  - `find(what,whatever you say)` true
  - `findWord(what,whatever you say)` false
  - `findWord(say,whatever you say)` true

#### Lookups - Tags

- `hasTag(STRING...)` - returns true if a given `tag` has been bestowed; if multiple arguments are given, returns true if *any* of the `tags` have been bestowed
- `hasTagAll(STRING, STRING...)` - returns true if *all* of the given `tags` have been bestowed

#### Lookups - Features

- `hasFeature(STRING...)` - returns true only if a `feature` with the given `"name"` has been bestowed; if multiple arguments are given, returns true if *any* of the `features` have been bestowed
- `hasFeatureAll(STRING, STRING...)` - returns true if *all* given `features` exist

These function can be extended in multiple ways; the extensions make the `STRING` name arguments optional

- `hasFeatureInCategory(ARRAY_STRING, STRING...)` - as above, but looks for `feature(s)` with *any* of the `ARRAY_STRING` as `"category"`
- `hasFeatureTagged(ARRAY_STRING, STRING...)` - as above, but looks for `feature(s)` with *any* of the `tag(s)` listed in the `ARRAY_STRING`
- `hasFeatureWithType(ARRAY_STRING, STRING...)` - as above, but looks for `feature(s)` with *any* of the `types` listed in the `ARRAY_STRING`

The `All` suffix can be added after the `Tagged` or `WithType` extension *(note: features can only have one category, so `InCategoryAll` would never match anything)*

- `hasFeatureAllInCategory(ARRAY_STRING, STRING...)` - as above, but returns true if *all* of the listed `features` are found within *any* of the categories
- `hasFeatureAllTagged(ANY, STRING...)` - as above, if *all* of the `features` have *any* of the listed `tags`
- `hasFeatureTaggedAll(ARRAY_STRING, STRING...)` - returns true if *any* of the `features` listed have *all* of the given `tags`
- `hasFeatureAllTaggedAll(ARRAY_STRING, STRING...)` - as above, if *all* of the `features` listed have *all* of the given `tags`
- `hasFeatureAllWithType(ANY, STRING...)` - returns true if *all* of the `features` have *any* of the listed `types`
- `hasFeatureWithTypeAll(ARRAY_STRING, STRING...)` - returns true if *any* of the `features` listed have *all* of the given `types`
- `hasFeatureAllWithTypeAll(ARRAY_STRING, STRING...)` - as above, if *all* of the `features` listed have *all* of the given `types`

The extensions can be applied together, but only in the order above

- `hasFeatureInCategoryTaggedWithType(ARRAY_STRING, ARRAY_STRING, ARRAY_STRING, STRING...)` - returns true if a `feature` is found with *any* of the given `STRINGS`, in *any* of the categories listed in the first `ARRAY_STRING`, and with *any* of the `tags` listed in the second `ARRAY_STRING`, and with *any* of the `types` listed in the third `ARRAY_STRING`

All of the below are valid

- `hasFeatureAllTaggedAllWithType` (all tags, any types)
- `hasFeatureInCategoryWithTypeAll` (in any category, with all types)
- `hasFeatureAllInCategoryTaggedAllWithTypeAll` (all features must have any category, all tags, and all types)

These are invalid

- `hasFeatureAllWithTypeTagged` should be `hasFeatureAllTaggedWithType`
- `hasFeatureTaggedAllInCategory` should be `hasFeatureInCategoryTaggedAll`
- `hasFeatureInCategoryWithTypeAllTagged` should be `hasFeatureInCategoryTaggedWithTypeAll`

### Getting multiple results

These functions should only be used inside other functions that accept multiple arguments (see next section)

- `getInputs(STRING...)` - returns the values of any inputs with the given name(s)
- `getScores(STRING...)` - returns the values of any scores with the given name(s)
- `getBonuses(STRING...)` - returns the values of any bonuses with the given name(s)

The functions above accept the same extensions as `hasFeature`, in the same order

- `getInputsWithType(one,two,three)` - gets all inputs with any of the types "one", "two", or "three"
- `getScoresWithTypeAll([att,basic],strength)` - gets all scores named "strength" with both "att" and "basic" types
- `getBonusesTagged([tag:one,tag:two])` - gets all bonuses with either the "tag:one" or "tag:two" tags
- `getInputsInCategoryTaggedAllWithTypeAll([att],[tag:one,tag:two],[secret,penalty])` - gets all inputs with with the "att" category, both the "tag:one" and "tag:two" tags, and both "secret" and "penalty" types
- `getScoresAll(name)` - works exactly the same as `getScores(name)`, no point in using it
- `getInputsTaggedInCategory` - is invalid, should be `getInputsInCategoryTagged`

Custom functions may require access to the `input`, `score`, etc. `Object` itself; you can get them by adding "Objects" after "get":

- `getObjectsInputs(name1,name2)` (all inputs named "name1" or "name2")
- `getObjectsBonusesTagged([stat:strength])` (all bonuses tagged "stat:strength")
- `getObjectsScoresInCategoryWithTypeAll([attribute],[basic,physical])` (all scores in category "attribute" with both types "basic" and "physical")

### Using multiple results

These functions should extract the results from a function and treat them as arguments

- `min()` and `max()` work as expected
- `sum()` adds all arguments together and returns the result
- `test(BooleanStringFunction, STRING, ANY...)` - this returns true if at least one of arguments passes the `BooleanStringFunction` test; the `STRING` represents the part of the test function that is to be replaced by the other arguments
- `testAll(BooleanStringFunction, STRING, ANY...)` - this returns true if *all* of the arguments pass the `BooleanStringFunction` test; the `STRING` represents the part of the test function that is to be replaced by the other arguments
- `multiple(NUMBER, BooleanStringFunction, STRING, ANY...)` - this returns true if at least `NUMBER` of arguments passes the `BooleanStringFunction` test; the `STRING` represents the part of the test function that is to be replaced by the other arguments

```javascript
// EXAMPLE
"multiple(3, X >= 5, X, getScoresByTag(skill:craft))" // returns true if at
            // least three scores with the skill:craft tag have values greater
            // than or equal to 5
"multiple(4, INPUT == 1, INPUT, getInputsByTag(spell:cleric))" // returns true
            // if at least four inputs with the spell:cleric tag have values
            // exactly equal to 1
"multiple(2, ? < 10, ?, getInputsByTag(is:kosher), getScoresByTag(non:fat))"
            // returns true if, among inputs with the is:kosher tag and scores
            // with the non:fat tag, at least two have values less than 10
```

### Conditionals and Loops

- `if(BooleanStringFunction,ReturnValueIfTrue,ReturnValueIfFalse)` - returns one of two values depending on if the `BooleanStringFunction` returns `true` or `false`

### `LookupObjects`

- Lookup Objects are basically inline JSON objects
  - *Note*: If possible, you should use a simple `getScore()` or similar function instead

```javascript
// If "strength score" is 20...
"100 / {\"query\":\"score\",\"name\":\"strength score\"}" // = 5
```

-------------------------------------------------

## Array Format

Formulae should be in Array form, as the order of Arrays is kept consistent when JSONs are parsed. Sub-arrays can be used like parentheses.

`(-b + squareRoot(b**2 - 4*a*c)) / (2*a)`

```javascript
[
    "divide",
    [
        "add",
        [
            "subtract",
            0,
            B
        ],
        "square root", [
            [
                "subtract",
                [
                    "multiply",
                    B,
                    B
                ],
                [
                    "multiply",
                    4,
                    A,
                    C
                ]
            ]
        ]
    ],
    [
        "multiply",
        2,
        A
    ]
]
```

### General Operations

- `"store", STR, ANY`

  - saves any value under the title of the given string so it can be used later

```javascript
[
  ["store", "X", 5], // makes a variable X equal to 5
  ["add", "X", 3],   // adds the variable X to 3, yielding 8
  ["store", "X", 6], // now X is equal to 6
  ["add", "X", 3]    // adds the variable X to 3, yielding 9
]
```

- `"filter", LookupObject, ANY...`
  - looks through the given `Values` and keeps only the ones who match the `LookupObject`?

### Getters and Setters (2)

- `"get [score||input||bonus||flag]", STR` - gets the current value of the given score, input, bonus or flag (string)
- `"set input", STR, Value` - sets the given input to the given `Value`

### Numeric Operations (2)

#### Returns single result

- `"add", NUM, NUM...` - adds all elements together
- `"subtract", NUM, NUM...` - starts with the first element, then subtracts the next elements one at a time

```javascript
[ "subtract", 30, 10, 1 ] // 30 - 10 = 20, 20 - 1 = 19
```

- `"multiply", NUM, NUM...` - multiplies all elements together
- `"divide", NUM, NUM...` - starts with the first element, then divides by the next element, then the next element, and so on

```javascript
[ "divide", 30, 3, 5 ] // 30 / 3 = 10, 10 / 5 = 2
```

- `"square root", NUM` - determines the square root of the 1st element; ignores any further elements
- `"random_int", INT, INT` - returns a random integer between the 1st and the 2nd elements, inclusive; ignores any further elements
- `"min", NUM...` - returns the lowest number among all elements
- `"max", NUM...` - returns the highest number among all elements
- `"round", NUM` - returns the number rounded to the nearest integer (0.5 will round up)
- `"ceil", NUM` - returns the number rounded to the nearest, higher integer
- `"floor", NUM` - returns the number rounded to the nearest, lower integer

```javascript
[
    ["round", 4.5],  // 5
    ["round", 4.49], // 4
    ["round", 4],    // 4
    ["ceil", 4.3],   // 5
    ["ceil", 4],     // 4
    ["floor", 4.8],  // 4
    ["floor", 5],    // 5
    ["ceil", -3.2],  // -3 (negative numbers may produce nonintuitive results,
]                    //    but this IS rounding to the nearest higher integer!)
```

#### Return multiple results (2)

- `"limit >", NUM, NUM...` - takes the first number and returns all subsequent numbers that are greater than that first number
  - >, >=, <, <=, and = are all valid limits
- `"query", LookupObject...` - returns the values of any/all scores/bonuses/whatever that match all `LookupObjects` supplied

### Query Objects

- `QueryObjects` are basically `LookupObjects` with an additional `"render"` property?

```javascript
{
    "query": [
        // One or more LookupObjects
    ],
    "formula": []
}
```

- `"query score", STRING, ANY...` - Acts like a query object, searching for a `score`. The following arguments must come in pairs, the first being the name of a query object property, the second being the value of that property
  - `"query bonus"`, `"query flag"`, and `"query feature"` work the same, searching for a `bonus`, `flag`, or `feature`.

### Conditionals and Loops (2)

- `"repeat by type", LookupObject...`
- `"if", LookupObject, ANY, ANY` - ?
