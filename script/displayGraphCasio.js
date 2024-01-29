
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

	clear() {
		this.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
				console.warn('Taille de texte inconnu :', text);
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
				console.warn('Texte inconnu :', text);
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
}

class DisplayGraphCasioVertical extends DisplayGraphCasio {
	constructor() {
		super();
		this.canvas.width = 64;
		this.canvas.height = 128;
	}

	fillRect(x, y, w, h) {
		this.ctx.fillRect(this.canvas.width - y, x, -h, w);
	}

	clearRect(x, y, w, h) {
		this.ctx.clearRect(this.canvas.width - y, x, -h, w);
	}
}