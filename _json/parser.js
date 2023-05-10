// ...

function getParser() {
	const FUNCTIONS = {
		//save
		//load
		//get(Score|Bonus|Input)
		//setInput
		//hasFeature[All][InCategory][Tagged[All]][WithType[All]]
		//get[Objects](Inputs|Bonuses|Scores)[InCategory][Tagged[All]][WithType[All]]
		squareRoot: Math.sqrt,
		round: Math.round,
		ceil: Math.ceil,
		floor: Math.floor,
		min: Math.min,
		max: Math.max,
		random: (x = 1) => Math.floor(Math.random() * x),
		randomInt: (x, y = undefined) => {
			if(y === undefined) {
				y = x;
				x = 0;
			}
			const range = y - x + 1;
			return Math.floor(Math.random() * range) + x;
		},
		find: (needle, haystack) => haystack.indexOf(needle) >= 0,
		findWord: (needle, haystack) => {
			let regex = new RegExp("\\b" + needle.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + "\\b");
			return haystack.match(regex) !== null;
		},
		test: (test, standee, ...testing) => {},
		testAll: (test, standee, ...testing) => {},
		multiple: (count, test, standee, ...testing) => {},
		if: (test, truth, falsity) => {},
	};

	function testForReservedCharacters(input, errorMsg, ...etc) {
		// Test for reserved characters
		let x = -1;
		if (etc.length === 0) {
			// If none are provided, default to the $@? known markers
			etc.push("$", "@", "?");
		}
		// Test them all
		const testFailed = etc.some(ch => {
			x = input.indexOf(ch);
			return x >= 0;
		});
		if (testFailed) {
			// Make a useful error message
			const pre = input.slice(0, x);
			const error = input.slice(x, x + 1);
			const post = input.slice(x + 1);
			throw new SyntaxError(`${errorMsg || "Reserved character in unquoted string"}: "${pre}>>> ${error} <<<${post}"`);
		}
	}

	function separateEnclosedSections(input, offset, regex, marker, errorMsg, splitter, ...enclosers) {
		const enclosures = [];
		let m;
		while (m = input.match(regex)) {
			const [x, pre, enclosed, post] = m;
			const n = enclosures.length + offset;
			input = `${pre}${marker}${n}${marker}${post}`;
			enclosures.push(splitter ? enclosed.split(splitter) : enclosed);
		}
		testForReservedCharacters(input, errorMsg, ...enclosers);
		return {
			enclosures,
			output: input
		};
	}

	function separateQuotedSections(input) {
		// `$1$` === quotations[1]
		return separateEnclosedSections(
			input,
			0,
			/^(.*?)\s*"([^"]*)"\s*(.*)$/,
			"$",
			"Open quotation marks",
			false,
			"\""
		);
	}

	function separateParentheticals(input) {
		// `@3@` === parentheticals[3]
		return separateEnclosedSections(
			input,
			0,
			/^(.*?)\s*\(\s*([^()]*?)\s*\)\s*(.*)$/,
			"@",
			"Unmatched \"(\" or \")\" found",
			/\s*,\s*/,
			"(",
			")"
		);
	}

	function isolateFunctions(input, inputParentheticals, marker = "?") {
		// [functionName, functionArgumentsAsString, markedBrackets]
		// `?12?` === functions[12]
		const regex = /^(.*?)([a-zA-Z_]+)@([0-9]+)@(.*)$/;
		const functions = [];
		const parentheticals = [];
		// Add text to inputParentheticals
		inputParentheticals.push([input]);
		// Now check all inputParentheticals
		while (inputParentheticals.length > 0) {
			let parenthetical = inputParentheticals.shift().slice();
			const checked = [];
			while(parenthetical.length > 0) {
				// Look for a function()...
				let m;
				let p = parenthetical.shift();
				while (m = p.match(regex)) {
					const [x, pre, funcName, parenNum, post] = m;
					// Identify which parenthetical this is associated with
					//   This should always be <= the index of the current parenthetical!
					const associatedParenthetical = Number(parenNum);
					// Save text with function marked
					const n = functions.length;
					p = `${pre}${marker}${n}${marker}${post}`;
					// Save functions
					functions.push([funcName, associatedParenthetical]);
				}
				checked.push(p);
			}
			parentheticals.push(checked);
		}
		// Remove original text from parentheticals
		const output = parentheticals.pop().pop();
		return {
			functions,
			parentheticals,
			output
		};
	}

	function parse(text) {
		//
		// Set aside quoted sections
		const separatedQuotes = separateQuotedSections(text);
		const quotations = separatedQuotes.enclosures;
		//
		// Set aside parentheticals
		const separatedParentheticals = separateParentheticals(separatedQuotes.output);
		let parentheticals = separatedParentheticals.enclosures;
		//
		// Set aside functions(in leftover text AND in parentheticals)
		const isolatedFunctions = isolateFunctions(separatedParentheticals.output, parentheticals.slice());
		const functions = isolatedFunctions.functions;
		parentheticals = isolatedFunctions.parentheticals;
		// Return everything
		return {
			quotations,
			parentheticals,
			functions,
			text: isolatedFunctions.output
		};
	}

	function makeToken(type, value, rank) {
		return {
			type,
			value,
			rank
		};
	}

	function tokenize(text) {
		// Analyze string and break into operators and references
		const output = [];
		// reduce and trim whitespace, then split into pieces
		chars = text.replace(/\s+/g, " ").trim().split('');
		let string = '';
		while (chars.length > 0) {
			let ch = chars.shift();
			if (ch === "?") {
				// Function
				let f = '';
				let next;
				while ((next = chars.shift()) !== "?") {
					f = f + next;
				}
				output.push(makeToken("function", Number(f), 3));
			} else if (ch === "@") {
				// Parenthetical
				let p = '';
				let next;
				while ((next = chars.shift()) !== "@") {
					p = p + next;
				}
				output.push(makeToken("parenthetical", Number(p), 2));
			} else if (ch === "$") {
				// Quoted string
				let q = '';
				let next;
				while ((next = chars.shift()) !== "$") {
					q = q + next;
				}
				output.push(makeToken("quoted", Number(q), 1));
			} else if (ch.match(/[|&=]/) && chars[0] === ch) {
				// &&, ||, ==  - these should never be at the end of an expression
				let rank = ch === "&" ? 10 : 11;
				if (chars[0] === ch) {
					output.push(makeToken("logic", ch + chars.shift(), rank));
				}
			} else if (ch.match(/[/*%]/)) {
				// Simple math operator
				let rank = 6;
				if (ch === "*" && chars[0] === ch) {
					// "*" should never be at the end of an expression
					chars.shift();
					ch = "**";
					rank = 5;
				}
				output.push(makeToken("operator", ch, rank));
			} else if (ch.match(/[+-]/)) {
				// Simple math operator
				output.push(makeToken("operator", ch, 7));
			} else if (ch.match(/[<>]/)) {
				// <=, <, >=, >
				if (chars[0] === "=") {
					ch = ch + chars.shift();
				}
				output.push(makeToken("comparison", ch, 8));
			} else if (ch == "!") {
				// !=, !
				let rank = 4
				if (chars[0] === "=") {
					ch = ch + chars.shift();
					rank = 9
				}
				output.push(makeToken("logic", ch, rank));
			} else if (ch >= "0" && ch <= "9" || ch === ".") {
				// Numeric
				let n = null;
				do {
					if (chars.length > 0) {
						n = chars.shift();
						if (n >= "0" && n <= "9" || n === ".") {
							ch = ch + n;
						} else {
							chars.unshift(n);
							n = null;
						}
					} else {
						n = null;
					}
				} while (n !== null);
				output.push(Number(ch));
			} else if (ch === " ") {
				// Whitespace. Ignore.
			} else {
				// Treat as string character
				while (chars.length > 0 && "0123456789.,|&!><=>%+-/*$@?".indexOf(chars[0]) == -1) {
					ch = ch + chars.shift();
				}
				output.push(ch);
			}
		}
		return output;
	}

	function getVal(input) {
		// Returns a single result if an array is given
		return Array.isArray(input) ? input.slice().pop() : input;
	}

	function seekForward(array, position) {
		// Returns the first element in the array at `position` or higher
		let max = array.length;
		while (position < max && (array[position] === undefined || array[position] === null)) {
			position++;
		}
		return [getVal(array[position]), position];
	}

	function seekBackward(array, position) {
		// Returns the first element in the array at `position` or lower
		while (position >= 0 && (array[position] === undefined || array[position] === null)) {
			position--;
		}
		return [getVal(array[position]), position];
	}

	function evaluate(input) {
		const {
			quotations,
			parentheticals,
			functions,
			text
		} = parse(input);
		//
		// Make copies of everything
		let output = [];
		const parameters = [];
		parentheticals.forEach((p, i) => {
			const copy = p.slice();
			// parameters => [string, indexOfParenthetical, indexInsideParenthetical]
			parameters.push(...copy.map((c, ci) => [c, i, ci]));
			output.push(copy);
		});
		parameters.push([text, output.length, 0]);
		output.push([text]);
		//
		// Start evaluating
		parameters.forEach((info, index) => {
			const [ stringText, outputIndex, subIndex ] = info;
			// tokenize string
			let tokens = tokenize(stringText);
			let ranks = {};
			tokens.forEach((t, i) => {
				if (t.rank) {
					if (!ranks[t.rank]) {
						ranks[t.rank] = [i]
					} else {
						ranks[t.rank].push(i);
					}
				}
			});
			if (ranks[1]) {
				// Quotations
				ranks[1].forEach(q => {
					let str = quotations[tokens[q].value];
					tokens[q] = str;
				});
			}
			if (ranks[2]) {
				// Parentheses and Brackets
				ranks[2].forEach(p => {
					// Parentheticals can only call on previous parentheticals, so these should already have been converted by the time we get to them.
					let value = output[tokens[p].value];
					tokens[p] = value;
				});
			}
			if (ranks[3]) {
				// Run functions
				// ....
				ranks[3].forEach(f => {
					const [func, associatedParenthetical] = functions[tokens[f].value];
					let value = FUNCTIONS[func](...output[associatedParenthetical]);
					tokens[f] = value;
				});
			}
			if (ranks[4]) {
				// Negation runs in reverse...
				let rankle = ranks[4].slice();
				rankle.reverse();
				rankle.forEach(pos => {
					let [value, found] = seekForward(tokens, pos + 1);
					delete tokens[pos];
					tokens[found] = !value;
				});
			}
			if (ranks[5]) {
				// Exponents
				ranks[5].forEach(pos => {
					let [first, behind] = seekBackward(tokens, pos - 1);
					let [last, ahead] = seekForward(tokens, pos + 1);
					tokens[pos] = first ** last;
					delete tokens[behind];
					delete tokens[ahead];
				});
			}
			if (ranks[6]) {
				// Multiplicatives
				ranks[6].forEach(pos => {
					const token = tokens[pos].value;
					let [first, behind] = seekBackward(tokens, pos - 1);
					let [last, ahead] = seekForward(tokens, pos + 1);
					switch (token) {
						case "*":
							tokens[pos] = first * last;
							break;
						case "/":
							tokens[pos] = first / last;
							break;
						case "%":
							tokens[pos] = first % last;
							break;
					}
					delete tokens[behind];
					delete tokens[ahead];
				});
			}
			if (ranks[7]) {
				// Additives
				ranks[7].forEach(pos => {
					const addition = tokens[pos].value === "+";
					let [first, behind] = seekBackward(tokens, pos - 1);
					let [last, ahead] = seekForward(tokens, pos + 1);
					tokens[pos] = addition ? first + last : first - last;
					delete tokens[behind];
					delete tokens[ahead];
				});
			}
			if (ranks[8]) {
				// Comparisons
				ranks[8].forEach(pos => {
					const token = tokens[pos].value;
					let [first, behind] = seekBackward(tokens, pos - 1);
					let [last, ahead] = seekForward(tokens, pos + 1);
					switch (token) {
						case ">=":
							tokens[pos] = first >= last;
							break;
						case ">":
							tokens[pos] = first > last;
							break;
						case "<=":
							tokens[pos] = first <= last;
							break;
						case "<":
							tokens[pos] = first < last;
							break;
					}
					delete tokens[behind];
					delete tokens[ahead];
				});
			}
			if (ranks[9]) {
				// Equalities
				ranks[9].forEach(pos => {
					const equals = tokens[pos].value === "==";
					let [first, behind] = seekBackward(tokens, pos - 1);
					let [last, ahead] = seekForward(tokens, pos + 1);
					tokens[pos] = equals ? first === last : first !== last;
					delete tokens[behind];
					delete tokens[ahead];
				});
			}
			if (ranks[10]) {
				// AND
				ranks[10].forEach(pos => {
					let [first, behind] = seekBackward(tokens, pos - 1);
					let [last, ahead] = seekForward(tokens, pos + 1);
					tokens[pos] = first && last;
					delete tokens[behind];
					delete tokens[ahead];
				});
			}
			if (ranks[11]) {
				// OR
				ranks[11].forEach(pos => {
					let [first, behind] = seekBackward(tokens, pos - 1);
					let [last, ahead] = seekForward(tokens, pos + 1);
					tokens[pos] = first || last;
					delete tokens[behind];
					delete tokens[ahead];
				});
			}
			const final = tokens.filter(x => true).pop();
			output[outputIndex][subIndex] = getVal(final);
		});
		return output.pop().pop();
	}

	return {
		parse,
		tokenize,
		evaluate
	};
}
