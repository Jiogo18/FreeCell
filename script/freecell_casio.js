/**
 * Portage du jeu Freecell depuis CASIO Basic.
 * Cette version n'a pas été testé et contient des Goto,
 * ce qui n'est pas possible en javascript.
 * Elle sert de version de référence pour la version sans Goto.
 * 
 * Date du programme original : ~2019
 * Taille : 6080 octets
 */

class DisplayGraphCasio {
	constructor() {
		this.canvas = document.getElementById('display');
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
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	}

	text(x, y, text) {
		this.ctx.fillText(text, x, y);
	}

	pixelOn(x, y) {
		this.ctx.fillRect(x, y, 1, 1);
	}

	pixelOff(x, y) {
		this.ctx.clearRect(x, y, 1, 1);
	}

	pixelTest(x, y) {
		return this.ctx.getImageData(x, y, 1, 1).data[0] == 0;
	}

	pixelChange(x, y) {
		if (this.pixelTest(x, y)) this.pixelOn(x, y);
		else this.pixelOff(x, y);
	}
}

/**
 * Variables globales
 * A et B sont la position du curseur de sélection
 * @type {{[key: string]: number}}
 */
const vars = {};
/**
 * str 9 contient les 52 cartes pour le reset (104 chiffres)
 * str 10 contient une carte pour le reset (2 chiffres)
 * @type {string[]}
 */
const str = [];
/**
 * mat A contient un historique (?)
 * @type {{A: number[][]}}
 */
const mat = {};
var getKey = 0;
/** @type {DisplayGraphCasio} */
var display;
// Freecell
// Par Jérôme L
// V 1.1
// (Portage d'un programme écrit en CASIO Basic)
const log = Math.log10;
const int = Math.floor;
const frac = (x) => x - int(x); // Reste de la division euclidienne
const randint = (a, b) => int(a + (b - a + 1) * Math.random());
const resetVars = () => { for (let i = 'a'; i <= 'z'; i++) vars[i] = 0; }
const waitForNewKey = () => {
	while (getKey == 0);
	while (getKey != 0); // TODO: ne pas bloquer
}
const freecell = {
	reset() {
		for (let i = 0; i < 9; i++) str[i] = '';
		for (let a = 1; a <= 52; a++) {
			if (a < 10) str[9] += '0';
			for (let b = 1 + int(log(a)); b >= 1; b--) {
				// str[9] += "0123456789"[int(10 * frac(a / Math.pow(10, b)))];
				str[9] += '' + int(10 * frac(a / Math.pow(10, b)));
			}
		}
		mat.A = [[0, 0], [1, 0]];
		vars.theta = 0;
		resetVars();

		this.affichage();
	},

	/**
	 * @param {DisplayGraphCasio} display
	 */
	affichageCasio(display) {
		display.clear();
		for (let y = 7; y < 55; y += 6) display.fline(20, y, 100, y);
		for (let x = 20; x < 100; x += 10) display.fline(x, 7, x, 55);

		display.text(55, 123, '%');
		for (vars.A = 21; vars.A <= 51; vars.A += 5) {
			for (vars.B = 8; vars.B <= 50; vars.B += 6) {

				// Affichage de la progression
				display.text(55, 115, 100 - int(str[9].length / 1.04));

				if (str[9].length != 2) {
					// Choisis une carte aléatoirement
					vars.C = randint(1, str[9].length / 2) * 2 - 1;
				} else {
					// S'il ne reste qu'une carte
					vars.C = 1;
				}

				// Extraire la carte de str[9] vers str[10]
				str[10] = str[9].slice(vars.C - 1, vars.C + 1);

				// (Version d'origine : une boucle compliquée pour convertir en nombre)
				vars.D = parseInt(str[10]);

				// Affichage de la carte
				display.pixelOn(vars.B, vars.A); // coin de présence
				// Affichage binaire de la couleur
				while (vars.D > 13) {
					vars.D -= 13;
					display.pixelChange(vars.B + 3, vars.A + 1);
					if (display.pixelTest(vars.B + 3, vars.A + 1)) {
						display.pixelOn(vars.B + 3, vars.A + 2);
					}
				}
				// Affichage binaire de la valeur
				if (vars.D > 7) {
					display.pixelOn(vars.B + 1, vars.A + 2);
					vars.D -= 8;
				}
				if (vars.D > 3) {
					display.pixelOn(vars.B + 2, vars.A + 2);
					vars.D -= 4;
				}
				if (vars.D > 1) {
					display.pixelOn(vars.B + 1, vars.A + 1);
					vars.D -= 2;
				}
				if (vars.D > 0) {
					display.pixelOn(vars.B + 2, vars.A + 1);
				}
				if (vars.A === 51 && vars.B === 26) {
					break;
				}
			}
		}
		str[9] = '';
		display.text(55, 115, '   '); // Efface la progression
		display.text(29, 11, '#'); // Le roi de FreeCell
		for (let y = 4; y <= 58; y += 6) {
			display.fline(9, y, 15, y);
		}
		// Couleur des cartes dans le dépôt (en haut à droite)
		display.pixelOn(14, 11);
		display.pixelOn(20, 12);
		display.pixelOn(26, 11);
		display.pixelOn(26, 12);
		resetVars();
	},

	affichage() {
		this.affichageCasio(display);
		this.tas();
	},

	/**
	 * Affichage des cartes dans le dépôt (en haut à droite)
	 * Lbl T:'TAS ??????
	 */
	tas() {
		do {
			for (vars.A = 1; vars.A <= 4; vars.A++) {
				if (vars.A === 1) vars.B = vars.I;
				if (vars.A === 2) vars.B = vars.J;
				if (vars.A === 3) vars.B = vars.K;
				if (vars.A === 4) vars.B = vars.L;
				display.pixelOff(vars.A * 6, 12);
				display.pixelOff(vars.A * 6 + 1, 12);
				display.pixelOff(vars.A * 6, 11);
				display.pixelOff(vars.A * 6 + 1, 11);
				if (vars.B > 7) {
					display.pixelOn(vars.A * 6, 12);
					vars.B -= 8;
				}
				if (vars.B > 3) {
					display.pixelOn(vars.A * 6 + 1, 12);
					vars.B -= 4;
				}
				if (vars.B > 1) {
					display.pixelOn(vars.A * 6, 11);
					vars.B -= 2;
				}
				if (vars.B > 0) {
					display.pixelOn(vars.A * 6 + 1, 11);
				}
			}
			if (vars.I + vars.J + vars.K + vars.L === 52) {
				// Goto G
			}

		} while (1);
	},

	/**
	 * Compter le nombre de cartes dans chaque colonne
	 * et stocker dans les variables U, V, W, P, Q, R, M, N
	 */
	taille() {
		for (vars.A = 1; vars.A <= 8; vars.A++) {
			vars.B = 0;
			while (display.pixelTest(vars.A * 6 + 2, vars.B * 5 + 21)) {
				vars.B++;
			}
			if (vars.A === 1) vars.U = vars.B;
			if (vars.A === 2) vars.V = vars.B;
			if (vars.A === 3) vars.W = vars.B;
			if (vars.A === 4) vars.P = vars.B;
			if (vars.A === 5) vars.Q = vars.B;
			if (vars.A === 6) vars.R = vars.B;
			if (vars.A === 7) vars.M = vars.B;
			if (vars.A === 8) vars.N = vars.B;
		}

		this.partieSansNom1();
	},

	/**
	 * Affichage du curseur de sélection de la colonne
	 */
	partieSansNom1() {
		for (vars.Y = 8; vars.Y <= 50; vars.Y += 6) {
			display.text(vars.Y, 105, ' ');
		}
		for (vars.Y = 35; vars.Y <= 53; vars.Y += 6) {
			display.text(vars.Y, 4, ' ');
		}
		display.text(8, 105, '>');
		if (mat.A[0][0] === mat.A[1][0]) {
			mat.A[1][0]++;
			// Augment(mat A, [[0],[0]]) permet d'agrandir la matrice A
			mat.A[0].push(0);
			mat.A[1].push(0);
		}
		if (vars.theta === 1) {
			// Goto theta
		}
		this.selecteur();
	},

	/**
	 * Lbl S:'+SELECTEUR
	 */
	selecteur() {
		display.text(1, 120, ' ');
		vars.theta = 0;
		waitForNewKey();

		let deplacement = false;
		switch (getKey) {
			case 'a': // 77 Résolution automatique
				// Goto theta
				break;
			case '0': // 71 Pause
				// Goto P
				break;
			case 'Escape': // 47, Exit
				// Goto A
				break;
			case 'ArrowUp': // 37, Flèche haut
				vars.A++;
				deplacement = true;
				break;
			case 'ArrowDown': // 28, Flèche bas
				vars.A--;
				deplacement = true;
				break;
			case '1': // 72
			case '2': // 62
			case '3': // 52
			case '4': // 73
			case '5': // 63
			case '6': // 53
			case '7': // 74
			case '8': // 64
			case '9': // 54
				vars.A = parseInt(getKey);
				deplacement = true;
				break;
			case 'S': // 78, Shift
				// Goto R
				break;
			case 'Enter': // 31, Exe
				vars.B = 1;
				display.text(8, 110, '<');
				this.selecteur2();
				break;
			default:
				// Goto S
				break;
		}
		if (vars.A > 12) vars.A = 1;
		if (vars.A < 1) vars.A = 12;
		if (deplacement) {
			for (vars.Y = 8; vars.Y <= 50; vars.Y += 6) {
				display.text(vars.Y, 105, ' ');
			}
			for (vars.Y = 35; vars.Y <= 53; vars.Y += 6) {
				display.text(vars.Y, 4, ' ');
			}
			if (vars.A > 8) display.text((vars.A - 8) * 6 + 29, 4, '<');
			else display.text(vars.A * 6 + 2, 105, '>');
		}

		this.selecteur(); // Goto S
	},

	/**
	 * Lbl C:'+SELECTEUR 2
	 */
	selecteur2() {
		waitForNewKey();
		if (vars.B > 8) display.text((vars.B - 8) * 6 + 29, 1, ' ');
		else display.text(vars.B * 6 + 2, 110, ' ');
		switch (getKey) {
			case 'Escape': // 47, Exit
				// Goto S
				break;
			case 'ArrowUp': // 37, Flèche haut
				vars.B++;
				break;
			case 'ArrowDown': // 28, Flèche bas
				vars.B--;
				break;
			case '1': // 72
			case '2': // 62
			case '3': // 52
			case '4': // 73
			case '5': // 63
			case '6': // 53
			case '7': // 74
			case '8': // 64
			case '9': // 54
				vars.B = parseInt(getKey);
				deplacement = true;
				break;
			case 'Enter': // 31, Exe
				const varsUVW = [vars.U, vars.V, vars.W, vars.P, vars.Q, vars.R, vars.M, vars.N];
				if (vars.A === vars.B || vars.A > 8 && vars.B > 8 || (vars.B <= 8 && varsUVW[vars.B - 1] === 16)) {
					// Goto C
				} else {
					this.deplace();
				}
				break;
			default:
				// Goto C
				break;
		}

		if (vars.B > 12) vars.B = 1;
		if (vars.B < 1) vars.B = 12;
		if (deplacement) {
			for (vars.Y = 8; vars.Y <= 50; vars.Y += 6) {
				display.text(vars.Y, 110, ' ');
			}
			for (vars.Y = 35; vars.Y <= 53; vars.Y += 6) {
				display.text(vars.Y, 1, ' ');
			}
			if (vars.B > 8) display.text((vars.B - 8) * 6 + 29, 1, '>');
			else display.text(vars.B * 6 + 2, 110, '<');
		}
	},

	/**
	 * @param {number} index
	 */
	tailleColonneCarte(index) {
		if (index <= 8) {
			const varsUVW = [vars.U, vars.V, vars.W, vars.P, vars.Q, vars.R, vars.M, vars.N];
			return varsUVW[index - 1];
		} else {
			return display.pixelTest((index - 8) * 6 + 29, 10) ? 1 : 0;
		}
	},

	/**
	 * @param {number} index
	 * @param {number} tailleColonne
	 */
	couleurCarte(index, tailleColonne) {
		if (index < 9) {
			return display.pixelTest(index * 6 + 5, tailleColonne * 5 + 18) * 2
				+ display.pixelTest(index * 6 + 5, tailleColonne * 5 + 17)
				+ 1;
		} else {
			return display.pixelTest((index - 8) * 6 + 32, 12) * 2
				+ display.pixelTest((index - 8) * 6 + 32, 11)
				+ 1;
		}
	},

	/**
	 * @param {number} index
	 * @param {number} tailleColonne
	 */
	valeurCarte(index, tailleColonne) {
		if (index < 9) {
			return display.pixelTest(index * 6 + 3, tailleColonne * 5 + 18) * 8
				+ display.pixelTest(index * 6 + 4, tailleColonne * 5 + 18) * 4
				+ display.pixelTest(index * 6 + 3, tailleColonne * 5 + 17) * 2
				+ display.pixelTest(index * 6 + 4, tailleColonne * 5 + 17);

		} else {
			return display.pixelTest((index - 8) * 6 + 30, 12) * 8
				+ display.pixelTest((index - 8) * 6 + 31, 12) * 4
				+ display.pixelTest((index - 8) * 6 + 30, 11) * 2
				+ display.pixelTest((index - 8) * 6 + 31, 11);
		}
	},

	/**
	 * Dernière carte dans le dépôt de la couleur
	 * @param {number} couleur
	 */
	valeurDepot(couleur) {
		return [vars.I, vars.J, vars.K, vars.L][couleur - 1];
	},

	/**
	 * @param {number} index
	 * @param {number} tailleColonne
	 */
	effacerCarte(index, tailleColonne) {
		if (index <= 8) {
			display.text(index * 6 + 2, tailleColonne * 5 + 16, ' ');
			for (let z = 1; z <= 5; z++) {
				display.pixelOn(index * 6 + 7, tailleColonne * 5 + 15 + z);
			}
		} else {
			index -= 8;
			display.text(index * 6 + 29, 10, ' ');
			for (let z = 1; z <= 5; z++) {
				display.pixelOn(index * 6 + 34, 9 + z);
			}
			index += 8;
		}
	},

	/**
	 * Dessine la carte à l'index donné
	 * @param {number} index
	 * @param {number} tailleColonne
	 * @param {number} couleur
	 * @param {number} valeur
	 */
	dessinerCarte(index, tailleColonne, couleur, valeur) {
		if (index <= 8) {
			display.pixelOn(index * 6 + 2, tailleColonne * 5 + 21);
			if (couleur >= 3) display.pixelOn(index * 6 + 5, tailleColonne * 5 + 23);
			if (couleur === 2 || couleur === 4) display.pixelOn(index * 6 + 5, tailleColonne * 5 + 22);

			if (valeur > 7) {
				display.pixelOn(index * 6 + 3, tailleColonne * 5 + 23);
				valeur -= 8;
			}
			if (valeur > 3) {
				display.pixelOn(index * 6 + 4, tailleColonne * 5 + 23);
				valeur -= 4;
			}
			if (valeur > 1) {
				display.pixelOn(index * 6 + 3, tailleColonne * 5 + 22);
				valeur -= 2;
			}
			if (valeur > 0) {
				display.pixelOn(index * 6 + 4, tailleColonne * 5 + 22);
			}
		} else {
			display.pixelOn((index - 8) * 6 + 29, 10);
			if (couleur >= 3) display.pixelOn((index - 8) * 6 + 32, 12);
			if (couleur === 2 || couleur === 4) display.pixelOn((index - 8) * 6 + 32, 11);

			if (valeur > 7) {
				display.pixelOn((index - 8) * 6 + 30, 12);
				valeur -= 8;
			}
			if (valeur > 3) {
				display.pixelOn((index - 8) * 6 + 31, 12);
				valeur -= 4;
			}
			if (valeur > 1) {
				display.pixelOn((index - 8) * 6 + 30, 11);
				valeur -= 2;
			}
			if (valeur > 0) {
				display.pixelOn((index - 8) * 6 + 31, 11);
			}
		}
	},

	/**
	 * Précédé par selecteur2
	 * Suivi TAS (Goto T)
	 */
	deplace() {
		vars.E = this.tailleColonneCarte(vars.A); // Taille de la colonne A / Position de la carte dans la colonne
		vars.C = this.couleurCarte(vars.A, vars.E); // Couleur de la carte A
		vars.G = this.valeurCarte(vars.A, vars.E); // Valeur de la carte A
		vars.F = this.tailleColonneCarte(vars.B); // Taille de la colonne B
		vars.D = this.couleurCarte(vars.B, vars.F); // Couleur de la carte B
		// vars.H = this.valeurCarte(vars.B, vars.F); // Valeur de la carte B
		var deplacement = false;
		if (vars.B <= 8) {
			// Colonnes
			if ((vars.D === 1 || vars.D === 4) === (vars.C === 1 || vars.C === 4)) {
				// Couleur noire (pique ou trèfle) des deux cartes
				// Goto S
			}

			vars.H = this.valeurCarte(vars.B, vars.F);
			if (vars.G + 1 === vars.H || vars.F === 0) {
				// La carte A peut être placée sur la carte B ou que la colonne B est vide
				deplacement = true;
			}
		}
		else {
			if (!display.pixelTest((vars.B - 8) * 6 + 29, 10)) {
				// La zone temporaire est vide
				deplacement = true;
			}
		}

		if (deplacement) {
			mat.A[0][0]++; // enregistre l'action
			mat.A[0][mat.A[0][0]] = vars.A;
			mat.A[1][mat.A[0][0]] = vars.B;
			this.effacerCarte(vars.A, vars.E);
			this.dessinerCarte(vars.B, vars.F, vars.C, vars.G);
			// Goto T
		}

		// Goto T
	},

	/**
	 * GO TAS ???
	 * Entouré d'un while 0 pour n'être exécuté que par le label
	 * Lbl R
	 */
	goTAS() {
		vars.B = this.tailleColonneCarte(vars.A);
		vars.C = this.couleurCarte(vars.A, vars.B);
		vars.D = this.valeurDepot(vars.C);
		vars.E = this.valeurCarte(vars.A, vars.B);
		if (vars.E === vars.D + 1) {
			vars.D++;
			mat.A[0][0]++;
			mat.A[0][mat.A[0][0]] = vars.A;
			mat.A[1][mat.A[0][0]] = vars.C + 12;
			this.effacerCarte(vars.A, vars.B);
		}
		if (vars.C === 1) vars.I = vars.D;
		if (vars.C === 2) vars.J = vars.D;
		if (vars.C === 3) vars.K = vars.D;
		if (vars.C === 4) vars.L = vars.D;
		// Goto T
	},

	/**
	 * Cancel
	 * Entouré d'un while 0 pour n'être exécuté que par le label
	 * Lbl A
	 */
	cancel() {
		if (mat.A[0][0] === 0) {
			// Goto S
		}
		vars.A = mat.A[0][mat.A[0][0]];
		mat.A[0][mat.A[0][0]] = 0;
		vars.B = mat.A[1][mat.A[0][0]];
		mat.A[1][mat.A[0][0]] = 0;

		// B peut être dans les colonnes, dans la zone temporaire ou dans le dépôt
		if (vars.B > 12) {
			// Annule un déplacement vers le dépôt
			vars.C = vars.B - 12;
			vars.H = this.valeurDepot(vars.C);
			if (vars.C === 1) vars.I--;
			if (vars.C === 2) vars.J--;
			if (vars.C === 3) vars.K--;
			if (vars.C === 4) vars.L--;
		} else {
			// Récupère la valeur de la carte B
			vars.E = this.tailleColonneCarte(vars.B);
			vars.C = this.couleurCarte(vars.B, vars.E);
			vars.H = this.valeurCarte(vars.B, vars.E);
			this.effacerCarte(vars.B, vars.E);
		}

		// A peut être dans les colonnes ou dans la zone temporaire
		var tailleColonneA = this.tailleColonneCarte(vars.A);
		this.dessinerCarte(vars.A, tailleColonneA, vars.C, vars.H);

		mat.A[0][0]--;
		// Goto T
	},

	/**
	 * Pause
	 * Lbl P
	 */
	pause() {
		if (vars.S === 1) {
			vars.S = 0;
		}
		display.clear();
		display.text(55, 115, 'Pause');
		waitForNewKey();
		// Recharger l'affichage
		// Goto T
	},

	/**
	 * Auto
	 * Déplace automatiquement les cartes vers le dépôt si possible.
	 * Garde le mode automatique tant qu'il y a des déplacements possibles.
	 * Lbl theta
	 */
	auto() {
		display.text(1, 120, 'A');
		vars.theta = 1;
		for (vars.A = 1; vars.A <= 12; vars.A++) {
			vars.E = this.tailleColonneCarte(vars.A);
			if (vars.E === 0) continue; // Pas de carte dans la colonne
			vars.C = this.couleurCarte(vars.A, vars.E);
			vars.G = this.valeurCarte(vars.A, vars.E);
			vars.H = this.valeurDepot(vars.C);
			if (vars.G === vars.H + 1) {
				// Goto R
				vars.H++;
				mat.A[0][0]++;
				mat.A[0][mat.A[0][0]] = vars.A;
				mat.A[1][mat.A[0][0]] = vars.C + 12;
				this.effacerCarte(vars.A, vars.E);
			}
		}

		// Goto S
	},

	/**
	 * Gagne
	 * Lbl G
	 */
	gagne() {
		for (let B = 96; B >= 21; B -= 5) {
			if (B === 92) B = 93;
			for (let A = 8; A <= 50; A += 6) {
				if (A === 50) A = 49;
				if (B < 96) display.text(A, B, ' ');
				display.pixelOn(A, B);
			}
		}
		display.text(17, 39, 'Game Over !');
		display.text(33, 35, 'Termine en :');
		display.text(40, 42, mat.A[0][0]);
		display.text(40, 58, 'coups');
		display.pixelOff(1, 1);
	},

	main() {
		this.reset();
	}
}
