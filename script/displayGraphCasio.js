
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
		this.ctx.fillStyle = 'black';
		this.clear();
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	fline(x1, y1, x2, y2) {
		this.ctx.fillRect(x1, y1, x2 - x1 + 1, y2 - y1 + 1);
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

		this.ctx.clearRect(x, y, largeur, 6);

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
				this.ctx.fillRect(x, y + 1, 3, 3);
				break;
			case '%':
				this.ctx.fillRect(x, y + 1, 1, 1);
				this.ctx.fillRect(x + 3, y + 4, 1, 1);
				for (let i = 0; i < 4; i++) {
					this.ctx.fillRect(x + i, y + 4 - i, 1, 1);
				}
				break;
			case '>':
				this.ctx.fillRect(x, y, 1, 5);
				for (let i = 0; i < 3; i++) {
					this.ctx.fillRect(x + i + 1, y + i, 1, 5 - 2 * i);
				}
				break;
				case '<':
					this.ctx.fillRect(x + 3, y, 1, 5);
					for (let i = 0; i < 3; i++) {
						this.ctx.fillRect(x + 2 - i, y + i, 1, 5 - 2 * i);
					}
					break;
			case '0':
				this.ctx.fillRect(x, y, 3, 5);
				this.ctx.clearRect(x + 1, y + 1, 1, 3);
				break;
			case '1':
				this.ctx.fillRect(x + 1, y, 1, 5);
				break;
			case '2':
				this.ctx.fillRect(x, y, 3, 1);
				this.ctx.fillRect(x + 2, y + 1, 1, 1);
				this.ctx.fillRect(x, y + 2, 3, 1);
				this.ctx.fillRect(x, y + 3, 1, 1);
				this.ctx.fillRect(x, y + 4, 3, 1);
				break;
			case '3':
				this.ctx.fillRect(x, y, 3, 1);
				this.ctx.fillRect(x, y + 2, 3, 1);
				this.ctx.fillRect(x, y + 4, 3, 1);
				this.ctx.fillRect(x + 2, y, 1, 5);
				break;
			case '4':
				this.ctx.fillRect(x, y, 1, 4);
				this.ctx.fillRect(x + 2, y, 1, 5);
				this.ctx.fillRect(x + 1, y + 3, 1, 1);
				break;
			case '5':
				this.ctx.fillRect(x, y, 3, 1);
				this.ctx.fillRect(x, y + 1, 1, 1);
				this.ctx.fillRect(x, y + 2, 3, 1);
				this.ctx.fillRect(x + 2, y + 3, 1, 1);
				this.ctx.fillRect(x, y + 4, 3, 1);
				break;
			case '6':
				this.ctx.fillRect(x, y, 3, 1);
				this.ctx.fillRect(x, y + 1, 1, 3);
				this.ctx.fillRect(x, y + 2, 3, 1);
				this.ctx.fillRect(x + 2, y + 3, 1, 1);
				this.ctx.fillRect(x, y + 4, 3, 1);
				break;
			case '7':
				this.ctx.fillRect(x, y, 3, 1);
				this.ctx.fillRect(x + 2, y + 1, 1, 4);
				break;
			case '8':
				this.ctx.fillRect(x, y, 3, 1);
				this.ctx.fillRect(x, y + 1, 1, 1);
				this.ctx.fillRect(x + 2, y + 1, 1, 1);
				this.ctx.fillRect(x, y + 2, 3, 1);
				this.ctx.fillRect(x, y + 3, 1, 1);
				this.ctx.fillRect(x + 2, y + 3, 1, 1);
				this.ctx.fillRect(x, y + 4, 3, 1);
				break;
			case '9':
				this.ctx.fillRect(x, y, 3, 1);
				this.ctx.fillRect(x, y + 1, 1, 1);
				this.ctx.fillRect(x + 2, y + 1, 1, 1);
				this.ctx.fillRect(x, y + 2, 3, 1);
				this.ctx.fillRect(x + 2, y + 3, 1, 1);
				this.ctx.fillRect(x, y + 4, 3, 1);
				break;
			default:
				console.warn('Texte inconnu :', text);
		}
		return largeur;
	}

	pixels = [];
	#setPixel(x, y, value) {
		const index = y * this.canvas.width + x;
		this.pixels[index] = value;
	}
	#getPixel(x, y) {
		const index = y * this.canvas.width + x;
		return this.pixels[index];
	}

	pixelOn(y, x) {
		this.ctx.fillRect(x, y, 1, 1);
		this.#setPixel(x, y, true);
	}

	pixelOff(y, x) {
		this.ctx.clearRect(x, y, 1, 1);
		this.#setPixel(x, y, false);
	}

	pixelTest(y, x) {
		return this.#getPixel(x, y);
	}

	pixelChange(y, x) {
		if (this.pixelTest(y, x)) this.pixelOn(y, x);
		else this.pixelOff(y, x);
	}
}
