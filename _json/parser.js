// ...

function parser () {
	function testForReservedCharacters(input, ...etc) {
		// Test for reserved characters
		if(etc && etc.some(x => input.indexOf(x) >= 0)) {
			throw new SyntaxError("Reserved character in unquoted string");
		} else if(input.indexOf("$") >= 0 || input.indexOf("@") >= 0) {
			throw new SyntaxError("Reserved character in unquoted string");
		}		
	}

	function separateQuotedSections (input) {
		const quotations = [];
		const marker = "$";
		let stored = '';
		let quoting = false;
		let x;
		while((x = input.indexOf("\"")) >= 0) {
			if(quoting) {
				stored = stored + `${marker}${quotations.length}${marker}`;
				quotations.push(input.slice(0, x));
				input = input.slice(x+1);
			} else {
				let slice = input.slice(0, x);
				testForReservedCharacters(slice);
				stored = stored + slice;
				input = input.slice(x + 1);
			}
			quoting = !quoting;
		}
		if(quoting) {
			throw new SyntaxError("Open quotation marks");
		}
		testForReservedCharacters(input);
		return { quotations, output: stored + input };
	}

	function separateBracketedSections (input, start, end) {
		const bracketed = [];
		const marker = "@";
		const depths = [];
		let x = input.indexOf(start);
		let y = input.indexOf(end);
		let count = 0;
		while (x >= 0 || y >= 0) {
			if(x >= 0 && x < y) {
//				console.log(x, start, input);
				// start of bracket
				input = input.slice(0, x) + input.slice(x + 1);
				depths.push(x);
			} else {
//				console.log(y, end, input);
				// end of bracket
				if(depths.length === 0) {
					throw new SyntaxError(`"${end}" encountered without beginning "${start}" beforehand`);
				}
				let begin = depths.pop();
				let n = bracketed.length;
				bracketed.push(input.slice(begin, y));
//				console.log(marker, n, "<" + input.slice(begin, y) + ">");
				input = `${input.slice(0, begin)}${marker}${n}${marker}${input.slice(y + 1)}`;
//				console.log(`<${input}>`);
			}
			x = input.indexOf(start);
			y = input.indexOf(end);
			count++;
			if(count > 10) {
				x = y = -1;
			}
		}
		return { bracketed, output: input };
	}

	function parse(text) {
		const parens = [];
		let stored = '';
		let quoting = false;
		let x;
		//
		// Set aside quoted sections
		const separatedQuotes = separateQuotedSections(text);
		const { quotations } = separatedQuotes;
		text = separatedQuotes.output;
		//
		// Set aside parentheticals
		const separatedParentheticals = separateBracketedSections(text, "(", ")");
		const parentheticals = separatedParentheticals.bracketed;
		text = separatedParentheticals.output;
		//
		// Set aside functions
	}

	return {};
};