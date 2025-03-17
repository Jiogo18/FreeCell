export class CasioContext {
	private context: CanvasRenderingContext2D;
	private pixels: boolean[];

	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
		this.context.fillStyle = 'black';
		this.pixels = new Array(128 * 64).fill(false);
		this.clear();
	}

	width() {
		return this.context.canvas.width;
	}

	height() {
		return this.context.canvas.height;
	}

	clear() {
		this.context.clearRect(0, 0, this.width(), this.height());
	}

	fillRect(x: number, y: number, w: number, h: number) {
		this.context.fillRect(x, y, w, h);
	}

	clearRect(x: number, y: number, w: number, h: number) {
		this.context.clearRect(x, y, w, h);
	}

	fline(x1: number, y1: number, x2: number, y2: number) {
		this.fillRect(x1, y1, x2 - x1 + 1, y2 - y1 + 1);
	}

	/**
	 * @returns {number} text width in pixels
	 */
	text(y: number, x: number, text: string): number {
		if (typeof text === 'number') text = '' + text;
		if (text.length > 1) {
			const chiffres = text.split('');
			var width = 0;
			for (let i = 0; i < chiffres.length; i++) {
				const taille = this.text(y, x, chiffres[i]);
				x += taille;
				width += taille;
			}
			return width;
		}

		var width = 0;
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
				// Different sizes depending on the character
				width = 4;
				break;
			case '#':
			case '%':
			case '>':
			case '<':
				width = 5;
				break;
			default:
				console.warn('Text width unknown:', text);
				break;
		}

		this.clearRect(x, y, width, 6);

		switch (text) {
			case ' ':
				// Retirer les valeurs dans this.pixels
				for (let i = 0; i < 4; i++) {
					for (let j = 0; j < 6; j++) {
						this.setPixel(x + i, y + j, false);
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
				break;
		}
		return width;
	}

	private setPixel(x: number, y: number, value: boolean) {
		this.pixels[y * this.width() + x] = value;
	}

	private getPixel(x: number, y: number) {
		return this.pixels[y * this.width() + x];
	}

	pixelOn(y: number, x: number) {
		this.fillRect(x, y, 1, 1);
		this.setPixel(x, y, true);
	}

	pixelOff(y: number, x: number) {
		this.clearRect(x, y, 1, 1);
		this.setPixel(x, y, false);
	}

	pixelTest(y: number, x: number) {
		return this.getPixel(x, y);
	}

	pixelChange(y: number, x: number) {
		if (this.pixelTest(y, x)) this.pixelOff(y, x);
		else this.pixelOn(y, x);
	}

	setColor(color: string) {
		this.context.fillStyle = color;
	}
}
