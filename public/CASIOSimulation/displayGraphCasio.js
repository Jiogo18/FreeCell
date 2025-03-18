// Font in pixel art of 5x7 pixels (starts NW, goes line by line, bits can be packed by 5 for a line)
const pixelFont = (function () {
	// 35 bits => split in 3 and 32 bits
	const C = [0b011, 0b10100011000010000100001000101110];
	const F = [0b111, 0b11100001000011110100001000010000];
	const O = [0b011, 0b10100011000110001100011000101110];
	const P = [0b111, 0b10100011000111110100001000010000];
	const U = [0b100, 0b01100011000110001100011000101110];
	return {
		A: [0b011, 0b10100011000111111100011000110001],
		B: [P[0], P[1] | 0b11000111110],
		C,
		D: [0b111, 0b00100101000110001100011001011100],
		E: [F[0], F[1] | 0b11111],
		F,
		G: [0b011, 0b10100011000010111100011000101111],
		H: [0b100, 0b01100011000111111100011000110001],
		I: [0b011, 0b10001000010000100001000010001110],
		J: [0b001, 0b11000100001000010000101001001100],
		K: [0b100, 0b01100101010011000101001001010001],
		L: [0b100, 0b00100001000010000100001000011111],
		M: [0b100, 0b01110111010110101100011000110001],
		N: [0b100, 0b01100011100110101100111000110001],
		O,
		P,
		Q: [O[0], O[1] ^ 0b1000001100011],
		R: [P[0], P[1] | 0b1001001010001],
		S: [C[0], C[1] ^ 0b1111010001 << 10],
		T: [0b111, 0b11001000010000100001000010000100],
		U,
		V: [U[0], U[1] ^ 0b1101101010],
		W: [0b100, 0b01100011010110101101011010101010],
		X: [0b100, 0b01100010101000100010101000110001],
		Y: [0b100, 0b01100011000101010001000010000100],
		Z: [0b111, 0b11000010001000100010001000011111],
		É: [0b000, 0b10001001111110000111101000011111],
	};
})();

/**
 * écran graphique de la calculatrice
 * les paramètres x et y sont inversés sauf pour fline.
 */
class DisplayGraphCasio {
	constructor() {
		/** @type {HTMLCanvasElement} */
		this.canvas = document.getElementById('display');
		/** @type {CanvasRenderingContext2D} */
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = 128;
		this.canvas.height = 64;
		this.longueur = 128;
		this.ctx.fillStyle = 'black';
		this.clear();
	}

	width() {
		return this.canvas.width;
	}

	height() {
		return this.canvas.height;
	}

	clear() {
		this.clearRect(0, 0, this.width(), this.height());
	}

	fillRect(x, y, w, h) {
		this.ctx.fillRect(x, y, w, h);
	}

	clearRect(x, y, w, h) {
		this.ctx.clearRect(x, y, w, h);
	}

	fline(x1, y1, x2, y2) {
		this.fillRect(x1, y1, x2 - x1 + 1, y2 - y1 + 1);
	}

	/**
	 * @returns {number} largeur du texte en pixels
	 */
	text(y, x, text) {
		if (typeof text === 'number') text = '' + text;
		if (text.length > 1) {
			const chiffres = text.split('');
			var largeur = 0;
			for (let i = 0; i < chiffres.length; i++) {
				const taille = this.text(y, x, chiffres[i]);
				x += taille;
				largeur += taille;
			}
			return largeur;
		}

		var largeur = 0;
		switch (text) {
			case ' ':
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case 'A':
				// Tailles différentes selon les caractères
				largeur = 4;
				break;
			case '#':
			case '%':
			case '>':
			case '<':
				largeur = 5;
				break;
			default:
				if (pixelFont[text] || pixelFont[text.toUpperCase()]) {
					largeur = 6;
				} else {
					console.warn('Taille de texte inconnu :', text);
					largeur = 6;
				}
				break;
		}

		this.clearRect(x, y, largeur, 6);

		switch (text) {
			case ' ':
				// Retirer les valeurs dans this.pixels
				for (let i = 0; i < 4; i++) {
					for (let j = 0; j < 6; j++) {
						this.#setPixel(x + i, y + j, false);
					}
				}
				break;
			case '#':
				this.fillRect(x, y + 1, 3, 3);
				break;
			case '%':
				this.fillRect(x, y + 1, 1, 1);
				this.fillRect(x + 3, y + 4, 1, 1);
				for (let i = 0; i < 4; i++) {
					this.fillRect(x + i, y + 4 - i, 1, 1);
				}
				break;
			case '>':
				this.fillRect(x, y, 1, 5);
				for (let i = 0; i < 3; i++) {
					this.fillRect(x + i + 1, y + i, 1, 5 - 2 * i);
				}
				break;
			case '<':
				this.fillRect(x + 3, y, 1, 5);
				for (let i = 0; i < 3; i++) {
					this.fillRect(x + 2 - i, y + i, 1, 5 - 2 * i);
				}
				break;
			case '0':
				this.fillRect(x, y, 3, 5);
				this.clearRect(x + 1, y + 1, 1, 3);
				break;
			case '1':
				this.fillRect(x + 1, y, 1, 5);
				break;
			case '2':
				this.fillRect(x, y, 3, 1);
				this.fillRect(x + 2, y + 1, 1, 1);
				this.fillRect(x, y + 2, 3, 1);
				this.fillRect(x, y + 3, 1, 1);
				this.fillRect(x, y + 4, 3, 1);
				break;
			case '3':
				this.fillRect(x, y, 3, 1);
				this.fillRect(x, y + 2, 3, 1);
				this.fillRect(x, y + 4, 3, 1);
				this.fillRect(x + 2, y, 1, 5);
				break;
			case '4':
				this.fillRect(x, y, 1, 4);
				this.fillRect(x + 2, y, 1, 5);
				this.fillRect(x + 1, y + 3, 1, 1);
				break;
			case '5':
				this.fillRect(x, y, 3, 1);
				this.fillRect(x, y + 1, 1, 1);
				this.fillRect(x, y + 2, 3, 1);
				this.fillRect(x + 2, y + 3, 1, 1);
				this.fillRect(x, y + 4, 3, 1);
				break;
			case '6':
				this.fillRect(x, y, 3, 1);
				this.fillRect(x, y + 1, 1, 3);
				this.fillRect(x, y + 2, 3, 1);
				this.fillRect(x + 2, y + 3, 1, 1);
				this.fillRect(x, y + 4, 3, 1);
				break;
			case '7':
				this.fillRect(x, y, 3, 1);
				this.fillRect(x + 2, y + 1, 1, 4);
				break;
			case '8':
				this.fillRect(x, y, 3, 1);
				this.fillRect(x, y + 1, 1, 1);
				this.fillRect(x + 2, y + 1, 1, 1);
				this.fillRect(x, y + 2, 3, 1);
				this.fillRect(x, y + 3, 1, 1);
				this.fillRect(x + 2, y + 3, 1, 1);
				this.fillRect(x, y + 4, 3, 1);
				break;
			case '9':
				this.fillRect(x, y, 3, 1);
				this.fillRect(x, y + 1, 1, 1);
				this.fillRect(x + 2, y + 1, 1, 1);
				this.fillRect(x, y + 2, 3, 1);
				this.fillRect(x + 2, y + 3, 1, 1);
				this.fillRect(x, y + 4, 3, 1);
				break;
			case 'A':
				this.fillRect(x + 1, y, 1, 1);
				this.fillRect(x, y + 1, 1, 4);
				this.fillRect(x + 2, y + 1, 1, 4);
				this.fillRect(x + 1, y + 2, 1, 1);
				break;
			default:
				const bin = pixelFont[text] ?? pixelFont[text.toUpperCase()];
				if (bin) {
					this.clearRect(x, y, 1, 8);
					for (let j = 0; j < 8; j++) {
						for (let i = 0; i < 5; i++) {
							const pos = [y + j, x + i + 1];
							const index = 39 - (i + j * 5);
							const on = index < 32
								? bin[1] & (1 << index)
								: bin[0] & (1 << (index - 32))
							if (on) {
								this.pixelOn(...pos);
							} else {
								this.pixelOff(...pos);
							}
						}
					}
				} else {
					console.warn('Texte inconnu :', text);
				}
		}
		return largeur;
	}

	pixels = [];
	#setPixel(x, y, value) {
		const index = y * this.longueur + x;
		this.pixels[index] = value;
	}
	#getPixel(x, y) {
		const index = y * this.longueur + x;
		return this.pixels[index] ? true : false;
	}

	pixelOn(y, x) {
		this.fillRect(x, y, 1, 1);
		this.#setPixel(x, y, true);
	}

	pixelOff(y, x) {
		this.clearRect(x, y, 1, 1);
		this.#setPixel(x, y, false);
	}

	pixelTest(y, x) {
		return this.#getPixel(x, y);
	}

	pixelChange(y, x) {
		if (this.pixelTest(y, x)) this.pixelOff(y, x);
		else this.pixelOn(y, x);
	}

	setColor(color) {
		this.ctx.fillStyle = color;
	}
}

class DisplayGraphCasioVertical extends DisplayGraphCasio {
	constructor() {
		super();
		this.canvas.width = 64;
		this.canvas.height = 128;
	}

	width() {
		return this.canvas.height;
	}

	height() {
		return this.canvas.width;
	}

	fillRect(x, y, w, h) {
		this.ctx.fillRect(this.canvas.width - y, x, -h, w);
	}

	clearRect(x, y, w, h) {
		this.ctx.clearRect(this.canvas.width - y, x, -h, w);
	}
}