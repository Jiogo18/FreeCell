// Open a .G1M file, parse it and save it as a txt
// Run with deno: deno run --allow-read --allow-write casio-parser.ts myprogramm.G1M

const inputFile: string = Deno.args[0];
const outputFile = inputFile + '.txt';
const textEncoder = new TextEncoder();
const e = (str: string) => textEncoder.encode(str);

console.log('Reading', inputFile);

let fileContent: Uint8Array = Deno.readFileSync(inputFile);
// Create a buffer with 4x the size to handle more text
const parsedContent = new Uint8Array(fileContent.length * 4);

const validASCIIChars = `\r !"%'(),.0123456789:<=>?ABCDEFGHIJKLMNOPQRSTUVWXYZ[]abcdefghijklmnopqrstuvwxyz{}~`
	.split('').map(c => c.charCodeAt(0));

const CASIOChars = {
	14: e('→'), // \u2192
	16: e('≤'),
	17: e('≠'),
	18: e('≥'),
	19: e('⇒'), // \u21d2
	137: e('+'),
	149: e('log '),
	153: e('-'),
	166: e('Int '),
	168: e('^'),
	169: e('*'),
	182: e('Frac '),
	185: e('/'),
	192: e('Ans'),
	206: e('θ'),
	226: e('Lbl '),
	236: e('Goto '),
	235: e('ViewWindow '),
};

/**
 * Words in 2 bytes
 * Known prefix are 127, 230, 247 or 249 (by category)
 */
const CASIOWords = {
	127: {
		64: e('Mat '),
		70: e('Dim '),
		73: e('Augment('),
		135: e('RanInt#('),
		143: e('Getkey'),
		176: e(' And '),
		177: e(' Or '),
	},
	230: {
		166: e('■'), // \u25a0
		154: e('◀'), // \u25c0
		155: e('►'), // \u25ba
		158: e('▸'), // \u25b8
	},
	247: {
		0: e('If '),
		1: e('Then '),
		2: e('Else '),
		3: e('IfEnd'),
		4: e('For '),
		5: e(' To '),
		6: e(' Step '),
		7: e('Next'),
		8: e('While '),
		9: e('WhileEnd'),
		10: e('Do'),
		11: e('LpWhile '),
		13: e('Break'),
		16: e('Locate '),
		24: e('ClrText'),
		25: e('ClrGraph'),
		147: e('StoPict '),
		148: e('RclPict '),
		165: e('Text '),
		167: e('F-Line '),
		171: e('PxlOn '),
		172: e('PxlOff '),
		173: e('PxlChg '),
		175: e('PxlTest('),
		210: e('AxesOff'),
	},
	249: {
		30: e('ClrMat '),
		49: e('StrLen('),
		51: e('StrSrc('),
		52: e('StrLeft('),
		53: e('StrRight('),
		54: e('StrMid('),
		63: e('Str '),
	},
}

let parsedIndex = 0;
let unknownChars: number[] = [];

function appendChar(char: number) {
	parsedContent[parsedIndex++] = char;
}
function appendArray(array: Uint8Array) {
	parsedContent.set(array, parsedIndex);
	parsedIndex += array.length;
}

for (let i = 86; i < fileContent.length;) {
	const char = fileContent[i];
	if (char === 0) {
		console.log('File parsed');
		break;
	} else if (CASIOWords[char]) {
		// 2 bytes
		const prefix = CASIOWords[char];
		const result = prefix[fileContent[i + 1]];
		if (result) {
			appendArray(result);
		} else {
			unknownChars.push(char, fileContent[i + 1]);
			parsedContent[parsedIndex++] = '#'.charCodeAt(0);
		}
		i += 2;
		continue;
	} else if (CASIOChars[char]) {
		appendArray(CASIOChars[char]);
	} else if (validASCIIChars.includes(char)) {
		appendChar(char);
	} else {
		unknownChars.push(char);
		parsedContent[parsedIndex++] = '#'.charCodeAt(0);
	}
	++i;
}

console.log('Unknown char', unknownChars);

console.log('Writing', outputFile)
Deno.writeFileSync(outputFile, parsedContent.slice(0, parsedIndex));
