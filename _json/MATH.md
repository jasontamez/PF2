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

## Numeric Operations

* `"add", NUM, NUM...` - adds all elements together
* `"subtract", NUM, NUM...` - starts with the first element, then subtracts the next elements one at a time
* `"multiply", NUM, NUM...` - multiplies all elements together
* `"divide", NUM, NUM...` - starts with the first element, then divides by the next element, then the next element, and so on
* `"square root", NUM` - determines the square root of the 1st element; ignores any further elements
* `"random_int", INT, INT` - returns a random integer between the 1st and the 2nd elements, inclusive; ignores any further elements
* `"min", NUM...` - returns the lowest number among all elements
* `"max", NUM...` - returns the highest number among all elements

