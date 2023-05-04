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

## String Format

### Order of operations

- These should respect the standard "PEDMAS" order of operations, with one addition.
    1. Lookup Objects
        - Evaluate `LookupObjects` from left to right
    2. Parentheses and Functions
        - Innermost parentheses and functions are evaluated before outer, from left to right
    3. Exponents
        - Evaluated left to right
    4. Division
        - Evaluated left to right
    5. Multiplication
        - Evaluated left to right
    6. Addition and Subtraction
        - Evaluated left to right

### General Functions

- `save(STRING,x)` - saves the value x as `STRING` for later use
    - It also returns the saved value
        - `save(X,5)+2` = 7 (and also saves 'X' with a value 5)
- `load(STRING)` - returns the value previously saved as `STRING`

### Getters and Setters

- `getScore(STRING)` - gets the current value of the given `score`
- `getBonus(STRING)` - gets the current value of the given `bonus`
- `getInput(STRING)` - gets the current value of the given `input`
- `setInput(STRING, Value)` - sets the given `input` to the given `Value`

### Numeric Operations

- Most mathematical symbols work as expected
    - `+` addition
    - `-` subtraction
    - `*` multiplication
    - `/` division
    - `x ^ y` raises "x" to the power of "y"
    - Parentheses work as expected
        - `5 + 2 * 5` = 15
        - `(5 + 2) * 5` = 35

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
    - `min(x,y,z)` returns the smallest number among x, y, and z
    - `max(x,y,z)` returns the highest number among x, y, and z
        - Both `min` and `max` can take any number of arguments
            - `min(1)` = 1
            - `max(56,30)` = 56
            - `max(45,20,10^2,17,500/10)` = 100 (10^2)

#### Return multiple results

- `"limit >", NUM, NUM...` - takes the first number and returns all subsequent numbers that are greater than that first number
    - >, >=, <, <=, and = are all valid limits
- `limit(x>y,z)` - returns y and/or z, if they are smaller than x
    - You can use `>`, `>=`, `<`, `<=`, and `=` in a `limit()`
        - `limit(5>6,1,0,14)` = 1 and 0
        - `limit(60<=6*10,85,-3)` = 60 (6*10) and -3

- `filter(x,y,z)` ?

- `getBonusesByTag(some:tag)` - returns the values of all bonuses with the given tag

### `LookupObjects`

- Lookup Objects are basically inline JSON objects
    - *Note*: If possible, you should use a simple `getScore()` or similar function instead

```javascript
// If "strength score" is 20...
"100 / {\"query\":\"score\",\"name\":\"strength score\"}" // = 5
```

### Conditionals and Loops

- `"repeat by type", LookupObject...`
- `"if", LookupObject, ANY, ANY` - ?

-------------------------------------------------

## Array Format

Formulae should be in Array form, as the order of Arrays is kept consistent when JSONs are parsed. Sub-arrays can be used like parentheses.

`(-b + squareRoot(b^2 - 4*a*c)) / (2*a)`

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

### Getters and Setters

- `"get [score|input|bonus|flag]", STR` - gets the current value of the given score, input, bonus or flag (string)
- `"set input", STR, Value` - sets the given input to the given `Value`

### Numeric Operations

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
    ["ceil", -3.2],  // -3 (negative numbers may produce results
]                    //    that seem strange, but this IS rounding
                     //    to the nearest higher integer!)
```

#### Return multiple results

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

### Conditionals and Loops

- `"repeat by type", LookupObject...`
- `"if", LookupObject, ANY, ANY` - ?
