// ...

function getParser() {
	// Global-ish variable to hold various contexts across functions
	let CONTEXT = {};

	// Helper functions
	function escapeRegex(input) {
		return input.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	}
	function checkForString (test) {
		let test_case = test;
		if(m = test.match(/^\$([0-9]+)\$$/)) {
			// This is a string, so we need to translate it before we can use it.
			test_case = this._evaluate(test);
		}
		return test_case;
	}
	function flatten(input, evaluate = true) {
		const final = [];
		const search = input.slice();
		while(search.length) {
			const item = evaluate ? this._evaluate(search.shift()) : search.shift();
			if(Array.is_array(item)) {
				search.unshift(...item);
			} else {
				final.push(item);
			}
		}
		return final;
	}

	// Standard fuctions

	// save/load
	function save(label, value) {
		return this._MEMORY[this._evaluate(label)] = this._evaluate(value);
	}
	function load(label) {
		return this._MEMORY[this._evaluate(label)];
	}
	function clear(label) {
		// Either delete a single saved value, or delete ALL saved values
		if(label !== undefined) {
			delete this._MEMORY[this._evaluate(label)];
		} else {
			this._MEMORY = {};
		}
		return;
	}
	// Math functions
	function squareRoot(n) {
		return Math.sqrt(this._evaluate(n));
	}
	function round(n) {
		return Math.round(this._evaluate(n));
	}
	function ceil(n) {
		return Math.ceil(this._evaluate(n));
	}
	function floor(n) {
		return Math.floor(this._evaluate(n));
	}
	function min(...args) {
		return Math.min(...this._flatten(args));
	}
	function max(...args) {
		return Math.max(...this._flatten(args));
	}
	function minmax(miniumum, maximum, value) {
		const x = this._evaluate(value);
		const min = this._evaluate(miniumum);
		if(min > x) {
			return min;
		}
		const max = this._evaluate(maximum);
		if(max < x) {
			return max;
		}
		return x;
	}
	function random (x) {
		const rando = Math.random();
		if(x !== undefined) {
			return rando * this._evaluate(x)
		}
	}
	function randomInt (x, y) {
		if(x === undefined) {
			x = 1
		} else {
			x = this._evaluate(x);
		}
		if(y === undefined) {
			y = x;
			x = 0;
		} else {
			y = this._evaluate(y);
		}
		const range = y - x + 1;
		return Math.floor(Math.random() * range) + x;
	}
	function sum (...args) {
		return this._flatten(args).reduce((accumulator, x) => accumulator + x, 0);
	}
	function product (...args) {
		// Returns 0 if no arguments
		return args.length === 0 ? 0 : this._flatten(args).reduce((accumulator, x) => accumulator * x);
	}
	// Logical functions
	function find (needle, haystack) {
		return this._evaluate(haystack).indexOf(this._evaluate(needle)) >= 0;
	}
	function findWord (needle, haystack) {
		let regex = new RegExp("\\b" + this._escapeRegex(this._evaluate(needle)) + "\\b");
		return this._evaluate(haystack).match(regex) !== null;
	}
	function test (test, standee, ...testing) {
		let regex = new RegExp(this._escapeRegex(standee), "g");
		const test_case = this._checkForString(test);
		return testing.some(value => {
			let subbed = test_case.replace(regex, `${value}`);
			return this._evaluate(subbed);
		});
	}
	function testAll (test, standee, ...testing) {
		let regex = new RegExp(this._escapeRegex(standee), "g");
		const test_case = this._checkForString(test);
		return testing.every(value => {
			let subbed = test_case.replace(regex, `${value}`);
			return this._evaluate(subbed);
		});
	}
	function multiple (count, test, standee, ...testing) {
		count = this._evaluate(count);
		if(count <= 0) {
			return true;
		}
		let regex = new RegExp(this._escapeRegex(standee), "g");
		let counter = 0;
		let m;
		const test_case = this._checkForString(test);
		while(testing.length > 0) {
			let value = testing.shift();
			let subbed = test_case.replace(regex, `${value}`);
			if(this._evaluate(subbed)) {
				counter++;
				if(counter >= count) {
					return true;
				}
			}
		}
		return false;
	}
	// Conditionals
	function _if (test, truth, falsity) {
		const test_case = this._checkForString(test);
		if(this._evaluate(test_case)) {
			return this._evaluate(truth);
		}
		return this._evaluate(falsity);
	}
	function _switch (...info) {
		const args = this._flatten(info, false);
		const [n] = args;
		let final;
		try {
			final = this._evaluate(args[n]);
		} catch (error) {
			// let it slide
		}
		return final === undefined ? 0 : final;
	}

	let FUNCTIONS = {
		// Global-ish variable to hold save/load variables
		_MEMORY: {},
		// Helper functions
		_escapeRegex: escapeRegex,
		_checkForString: checkForString,
		_flatten: flatten,
		// Main functions
		save,
		load,
		clear,
		//get(Score|Bonus|Input)
		//setInput
		//has(Score|Tag)[All]
		//hasFeature[All][InCategory][Tagged[All]][WithType[All]]
		//get[Objects](Inputs|Scores)[InCategory][Tagged[All]][WithType[All]]
		//countFeature[InCategory][Tagged[All]][WithType[All]]
		//count(Inputs|Scores)[InCategory][Tagged[All]][WithType[All]]
		//
		//  the above must be ready in case they get an array as an argument!
		//
		squareRoot,
		round,
		ceil,
		floor,
		min,
		max,
		sum,
		product,
		random,
		randomInt,
		find,
		findWord,
		test,
		testAll,
		multiple,
		if: _if,
		switch: _switch
	};

	function addFunction(...functions) {
		// addFunction([function_name, function(){}], ...)
		functions.forEach(([functionName, func]) => {
			if(!functionName.match(/^[a-zA-Z][_a-zA-Z0-9]*$/)) {
				throw new SyntaxError(`Invalid function name "${functionName}" - Functions must begin with a letter, and can only contain letters, numbers, and the underscore`)
			}
			FUNCTIONS[functionName] = func;
		});
	}

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

	function separateQuotedSections(input, offset = 0) {
		// `$1$` === quotations[1]
		let temp = String(Math.floor(Math.random() * 100000) + 1)
			+ "x" + String(Math.floor(Math.random() * 100000) + 1)
			+ "x" + String(Math.floor(Math.random() * 100000) + 1);
		let detox = new RegExp(temp, "g");
		let testing = input.replace(/\\"/g, temp);
		const {enclosures, output} = separateEnclosedSections(
			input,
			offset,
			/^(.*?)\s*"([^"]*)"\s*(.*)$/,
			"$",
			"Open quotation marks",
			false,
			"\""
		);
		return {
			enclosures: enclosures.map(e => e.replace(detox, '"')),
			output: output.replace(detox, '"')
		};
	}

	function separateParentheticals(input, offset = 0) {
		// `@3@` === parentheticals[3]
		return separateEnclosedSections(
			input,
			offset,
			/^(.*?)\s*\(\s*([^()]*?)\s*\)\s*(.*)$/,
			"@",
			"Unmatched \"(\" or \")\" found",
			/\s*,\s*/,
			"(",
			")"
		);
	}

	function isolateFunctions(input, offset = 0, marker = "?") {
		// [functionName, functionArguments]
		// `?12?` === functions[12]
		let m;
		let scanned = '';
		const functions = [];
		const regex = /^(.*?)\b([a-zA-Z][a-zA-Z_0-9]*)\s*\((.*)$/;
		// search for functions
		while(m = input.match(regex)) {
			const [x, pre, functionName, post] = m;
			let chars = post.split('');
			let count = 1;
			let args = [];
			// Look for end of function
			while(count > 0 && chars.length > 0) {
				const ch = chars.shift();
				if(ch === "(") {
					count++;
				} else if(ch === ")") {
					count--;
				}
				args.push(ch)
			}
			// Did we find a good end?
			if(count > 0) {
				throw new SyntaxError(`Function "${functionName}" missing end parenthesis: "(${post}"`);
			}
			// Save previous text
			scanned = scanned + pre;
			// Leftovers become new search string
			input = chars.join('');
			// Remove final ")" from arguments
			args.pop();
			// Compile arguments
			let funcArgs = args.join('');
			// Look for functions inside the arguments!
			const recursed = isolateFunctions(funcArgs, offset, marker);
			functions.push(...recursed.functions);
			// Save function info
			scanned = scanned + `${marker}${functions.length + offset}${marker}`;
			functions.push([
				functionName,
				recursed.output.split(/\s*,\s*/)
			]);
		}
		return {
			functions,
			output: scanned + input
		}
	}

	function parse(text) {
		// Set aside quoted sections
		let previous = CONTEXT.quotations || [];
		const separatedQuotes = separateQuotedSections(text, previous.length);
		const quotations = previous.concat(separatedQuotes.enclosures);
		//
		// Set aside functions
		previous = CONTEXT.functions || [];
		const isolatedFunctions = isolateFunctions(separatedQuotes.output, previous.length);
		const functions = previous.concat(isolatedFunctions.functions);
		//
		// Set aside parentheticals
		previous = CONTEXT.parentheticals || [];
		const separatedParentheticals = separateParentheticals(isolatedFunctions.output, previous.length);
		let parentheticals = previous.concat(separatedParentheticals.enclosures);
		// Return everything
		return {
			quotations,
			functions,
			parentheticals,
			text: separatedParentheticals.output
		};
	}
	// Make available to FUNCTIONS
	FUNCTIONS._parse = parse;

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
				output.push(makeToken("function", Number(f), 2));
			} else if (ch === "@") {
				// Parenthetical
				let p = '';
				let next;
				while ((next = chars.shift()) !== "@") {
					p = p + next;
				}
				output.push(makeToken("parenthetical", Number(p), 3));
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
				let rank = ch === "&" ? 10 : (ch === "=" ? 9 : 11);
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
			} else if (ch === "+") {
				// Simple addition
				output.push(makeToken("operator", ch, 7));
				// Subtraction is handled later, with negative numbers
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
			} else if (ch === "-" || (ch >= "0" && ch <= "9" || ch === ".")) {
				// Numeric or subtraction
				//
				// test for subtraction
				let test = true;
				if(ch === "-") {
					test = output.length;
					// Possibly subtraction
					if((chars[0] < "0" || chars[0] > "9") && chars[0] !== ".") {
						// Negative numbers MUST have the - next to the numeric
						test = false;
					} else if (test > 0) {
						let prev = output[test - 1];
						// See if this was an object
						if(prev.rank && ((prev.type === "operator" || prev.type === "comparison" || prev.type === "logic"))) {
							// Assume that we're numeric if the previous was *, +, >=, !, or the like
							test = true;
						} else {
							// Assume we're subtraction
							test = false;
						}
					} else {
						// Nothing in output == must be numeric
						test = true;
					}
				}
				if(test) {
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
				} else {
					// Subtraction
					output.push(makeToken("operator", ch, 7));
				}
			} else if (ch === " ") {
				// Whitespace. Ignore.
			} else {
				// Treat as string character
				while (chars.length > 0 && "0123456789.,|&!><=>%+-/*$@?".indexOf(chars[0]) === -1) {
					ch = ch + chars.shift();
				}
				output.push(ch.trim());
			}
		}
		return output;
	}
	// Make available to FUNCTIONS
	FUNCTIONS._tokenize = tokenize;

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
			functions,
			parentheticals,
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
				// Functions
				// Save old context
				const oldContext = {...CONTEXT};
				// Establish current context
				CONTEXT = { quotations, functions, parentheticals };
				// Run functions
				ranks[2].forEach(f => {
					const [func, args] = functions[tokens[f].value];
					let value = FUNCTIONS[func](...args);
					tokens[f] = value;
				});
				// Restore old context
				CONTEXT = {...oldContext};
			}
			if (ranks[3]) {
				// Parentheses
				ranks[3].forEach(p => {
					// Parentheticals can only call on previous parentheticals, so these should already have been converted by the time we get to them.
					let value = output[tokens[p].value];
					tokens[p] = value;
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
	// Make available to FUNCTIONS
	FUNCTIONS._evaluate = evaluate;

	return {
		parse,
		tokenize,
		evaluate,
		addFunction
	};
}
