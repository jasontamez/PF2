# Math

Formulae should be in Array form, as the order of Arrays is kept consistent when JSONs are parsed. Sub-arrays can be used like parentheses.

`(-b + sqrt(b^2 - 4ac)) / 2a`

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

## General Operations

* `"store", STR, ANY` - saves any value under the title of the given string so it can be used later
```javascript
[
  ["store", "X", 5], // makes a variable X equal to 5
  ["add", "X", 3],   // adds the variable X to 3, yielding 8
  ["store", "X", 6], // now X is equal to 6
  ["add", "X", 3]    // adds the variable X to 3, yielding 9
]
```
* `"get score", STR` - gets the current value of the given score (string)
* `"set score", STR, NUM` - sets the given score (string) to the given number
* `"get bonuses", STR`

## Numeric Operations

* `"add", NUM, NUM...` - adds all elements together
* `"subtract", NUM, NUM...` - starts with the first element, then subtracts the next elements one at a time
```javascript
[ "subtract", 30, 10, 1 ] // 30 - 10 = 20, 20 - 1 = 19
```
* `"multiply", NUM, NUM...` - multiplies all elements together
* `"divide", NUM, NUM...` - starts with the first element, then divides by the next element, then the next element, and so on
```javascript
[ "divide", 30, 3, 5 ] // 30 / 3 = 10, 10 / 5 = 2
```
* `"square root", NUM` - determines the square root of the 1st element; ignores any further elements
* `"random_int", INT, INT` - returns a random integer between the 1st and the 2nd elements, inclusive; ignores any further elements
* `"min", NUM...` - returns the lowest number among all elements
* `"max", NUM...` - returns the highest number among all elements
* `"round", NUM` - returns the number rounded to the nearest integer (0.5 will round up)
* `"ceil", NUM` - returns the number rounded to the nearest, higher integer
* `"floor", NUM` - returns the number rounded to the nearest, lower integer
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

## Query Objects

* `QueryObjects` are basically `LookupObjects` with an additional `"render"` property?

