/**
 * Portage du jeu Freecell depuis CASIO Basic.
 * Cette version ne comporte pas de Goto/Lbl pour l'utiliser en js.
 * La boucle principale est selecteur().
 * Les fonctions avec une entrée utilisateur sont en async pour attendre un appui sur une touche.
 * 
 * Date du programme original : ~2019
 * Taille : 6080 octets
 */

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
const waitForNewKey = async () => {
	// Attendre un nouvel appui sur une touche sans bloquer le thread
	var passeA0 = false; // Si getkey est tombé à 0 (touche relâchée)
	await new Promise((resolve) => setInterval(() => {
		if (!passeA0 && getKey === 0) passeA0 = true;
		else if (passeA0 && getKey) resolve(getKey);
	}, 10));
}
const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const freecell = {
	/**
	 * Question pour charger une partie en cours
	 * @Prédécesseurs : rien
	 * @Sucesseurs : reset, pause
	 */
	async choixCharger() {
		console.log('+ Choix charger');
		vars.S = 0; // Pour éviter d'enregistrer la valeur quand on quitte
		// Entrée utilisateur "Charger la partie "?->vars.S
		if (vars.S === 1) {
			// Goto P
			return true;
		}
		console.log('- Choix charger');

		await this.reset();
		return false;
	},

	/**
	 * Initialisation
	 * @Prédécesseurs : choixCharger
	 * @Sucesseurs : affichage
	 */
	async reset() {
		console.log('+ Reset');
		for (let i = 0; i <= 9; i++) str[i] = '';
		for (let a = 1; a <= 52; a++) {
			if (a < 10) str[9] += '0';
			for (let b = 1 + int(log(a)); b >= 1; b--) {
				// str[9] += "0123456789"[int(10 * frac(a / Math.pow(10, b)))];
				str[9] += '' + int(10 * frac(a / Math.pow(10, b)) + 1e-6); // +1e-6 car 0.999999
			}
		}
		mat.A = [[0, 0], [1, 0]];
		vars.theta = 0;
		resetVars();

		console.log('- Reset');
		await this.affichageInit();
	},

	/**
	 * Mélange de l'affichage et de l'initialisation
	 * @Prédécesseurs : reset
	 * @Sucesseurs : taille
	 */
	async affichageInit() {
		console.log('+ Affichage init');
		display.clear();
		for (let y = 7; y <= 55; y += 6) display.fline(20, y, 100, y);
		for (let x = 20; x <= 100; x += 5) display.fline(x, 7, x, 55);

		display.text(55, 123, '%');
		for (vars.A = 21; vars.A <= 51; vars.A += 5) {
			for (vars.B = 8; vars.B <= 50; vars.B += 6) {

				// Affichage de la progression
				display.text(55, 115, 100 - int(str[9].length / 1.04));
				await sleep(20); // Temps de chargement simulé

				if (str[9].length != 2) {
					// Choisis une carte aléatoirement
					vars.C = randint(1, str[9].length / 2) * 2 - 1;
				} else {
					// S'il ne reste qu'une carte
					vars.C = 1;
				}

				// Extraire la carte de str[9] vers str[10]
				str[10] = str[9].slice(vars.C - 1, vars.C + 1);
				str[9] = str[9].slice(0, vars.C - 1) + str[9].slice(vars.C + 1);

				// (Version d'origine : une boucle compliquée pour convertir en nombre)
				vars.D = parseInt(str[10]);

				// Affichage de la carte
				display.pixelOn(vars.B, vars.A); // coin de présence
				// Affichage binaire de la couleur
				while (vars.D > 13) {
					vars.D -= 13;
					display.pixelChange(vars.B + 3, vars.A + 1);
					if (!display.pixelTest(vars.B + 3, vars.A + 1)) {
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

		console.log('- Affichage init');
		this.tas();
	},

	/**
	 * Affichage des cartes dans le dépôt (en haut à droite)
	 * @Prédécesseurs : affichage
	 * @Sucesseurs : taille, gagne
	 * Lbl T:'TAS
	 */
	tas() {
		console.log('+ TAS');
		for (let A = 1; A <= 4; A++) {
			if (A === 1) vars.B = vars.I;
			if (A === 2) vars.B = vars.J;
			if (A === 3) vars.B = vars.K;
			if (A === 4) vars.B = vars.L;
			display.pixelOff(A * 6, 12);
			display.pixelOff(A * 6 + 1, 12);
			display.pixelOff(A * 6, 11);
			display.pixelOff(A * 6 + 1, 11);
			if (vars.B > 7) {
				display.pixelOn(A * 6, 12);
				vars.B -= 8;
			}
			if (vars.B > 3) {
				display.pixelOn(A * 6 + 1, 12);
				vars.B -= 4;
			}
			if (vars.B > 1) {
				display.pixelOn(A * 6, 11);
				vars.B -= 2;
			}
			if (vars.B > 0) {
				display.pixelOn(A * 6 + 1, 11);
			}
		}
		if (vars.I + vars.J + vars.K + vars.L === 52) {
			console.log('- TAS');
			this.gagne(); // Goto G
			return;
		}

		console.log('- TAS');
		this.taille();
	},

	/**
	 * Compter le nombre de cartes dans chaque colonne
	 * et stocker dans les variables U, V, W, P, Q, R, M, N
	 * @Prédécesseurs : tas
	 * @Sucesseurs : partieSansNom1
	 */
	taille() {
		console.log('+ Taille');
		for (let A = 1; A <= 8; A++) {
			vars.B = 0;
			while (display.pixelTest(A * 6 + 2, vars.B * 5 + 21)) {
				vars.B++;
				if (vars.B > 1000) throw new Error('Boucle infinie');
			}
			if (A === 1) vars.U = vars.B;
			if (A === 2) vars.V = vars.B;
			if (A === 3) vars.W = vars.B;
			if (A === 4) vars.P = vars.B;
			if (A === 5) vars.Q = vars.B;
			if (A === 6) vars.R = vars.B;
			if (A === 7) vars.M = vars.B;
			if (A === 8) vars.N = vars.B;
		}

		console.log('- Taille');
		this.effaceCurseurs();
	},

	/**
	 * Efface les curseurs, prépare l'historique mat.A,
	 * appel theta si le mode automatique est activé
	 * @Prédécesseurs : taille
	 * @Sucesseurs : selecteur, auto
	 */
	effaceCurseurs() {
		console.log('+ efface curseurs');
		for (let Y = 8; Y <= 50; Y += 6) {
			display.text(Y, 105, ' ');
		}
		for (let Y = 35; Y <= 53; Y += 6) {
			display.text(Y, 4, ' ');
		}
		if (mat.A[0][0] === mat.A[1][0]) {
			mat.A[1][0]++;
			// Augment(mat A, [[0],[0]]) permet d'agrandir la matrice A
			mat.A[0].push(0);
			mat.A[1].push(0);
		}
		if (vars.theta === 1) {
			console.log('- efface curseurs');
			this.theta(); // Goto theta
			return;
		}
		// retourne jusqu'à la boucle du selecteur
		console.log('- efface curseurs');
	},

	/**
	 * Sélecteur de la carte A
	 * @Prédécesseurs : rien
	 * @Sucesseurs : auto, pause, cancel, goTAS, selecteur2
	 * Lbl S
	 */
	async selecteur() {
		vars.A = 1;
		display.text(8, 105, '>');
		console.log('+ Selecteur');
		do {
			display.text(1, 120, ' ');
			vars.theta = 0;
			await waitForNewKey();

			switch (getKey) {
				case 'a': // 77 Résolution automatique
					await this.auto(); // Goto theta
					break;
				case '0': // 71 Pause
					// Goto P
					await this.pause();
					break;
				case 'Escape': // 47, Exit
					this.cancel(); // Goto A
					break;
				case 'ArrowUp': // 28, Flèche haut
					vars.A--;
					break;
				case 'ArrowDown': // 37, Flèche bas
					vars.A++;
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
					break;
				case 's': // 78, Shift
					this.goTAS(); // Goto R
					break;
				case 'Enter': // 31, Exe
				case ' ':
					await this.selecteur2();
					break;
				default:
					// Boucle dans le selecteur, Goto S
					break;
			}
			if (vars.A > 12) vars.A = 1;
			if (vars.A < 1) vars.A = 12;
			for (let Y = 8; Y <= 50; Y += 6) {
				display.text(Y, 105, ' ');
			}
			for (let Y = 35; Y <= 53; Y += 6) {
				display.text(Y, 4, ' ');
			}
			if (vars.A > 8) display.text((vars.A - 8) * 6 + 29, 4, '<');
			else display.text(vars.A * 6 + 2, 105, '>');

			// Boucle dans le selecteur, Goto S
		} while (1);
	},

	/**
	 * Sélecteur de la carte B
	 * @Prédécesseurs : selecteur
	 * @Sucesseurs : selecteur, deplace
	 * Lbl C
	 */
	async selecteur2() {
		vars.B = 1;
		display.text(8, 110, '<');
		console.log('+ Selecteur 2');
		do {
			await waitForNewKey();
			if (vars.B > 8) display.text((vars.B - 8) * 6 + 29, 1, ' ');
			else display.text(vars.B * 6 + 2, 110, ' ');
			switch (getKey) {
				case 'Escape': // 47, Exit
					// Retourner au selecteur 1, Goto S
					return;
				case 'ArrowUp': // 28, Flèche haut
					vars.B--;
					break;
				case 'ArrowDown': // 37, Flèche bas
					vars.B++;
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
					break;
				case 'Enter': // 31, Exe
				case ' ':
					const varsUVW = [vars.U, vars.V, vars.W, vars.P, vars.Q, vars.R, vars.M, vars.N];
					if (vars.A === vars.B || vars.A > 8 && vars.B > 8 || (vars.B <= 8 && varsUVW[vars.B - 1] === 16)) {
						// Boucle dans le selecteur 2, Goto C
						break;
					} else {
						this.deplace(); // suite
						return;
					}
				default:
					// Boucle dans le selecteur 2, Goto C
					break;
			}

			if (vars.B > 12) vars.B = 1;
			if (vars.B < 1) vars.B = 12;
			for (let Y = 8; Y <= 50; Y += 6) {
				display.text(Y, 110, ' ');
			}
			for (let Y = 35; Y <= 53; Y += 6) {
				display.text(Y, 1, ' ');
			}
			if (vars.B > 8) display.text((vars.B - 8) * 6 + 29, 1, '>');
			else display.text(vars.B * 6 + 2, 110, '<');

			// Boucle dans le selecteur 2, Goto C
		} while (1);
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
	 * @Prédécesseurs : selecteur2
	 * @Sucesseurs : selecteur, TAS
	 */
	deplace() {
		console.log('+ Deplace');
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
				console.log('- Deplace');
				return; // Goto S
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

		console.log('- Deplace');
		this.tas(); // Goto T
	},

	/**
	 * GO TAS
	 * Envoyer la carte A dans le dépôt si possible
	 * Entouré d'un while 0 pour n'être exécuté que par le label
	 * @Prédécesseurs : selecteur, auto
	 * @Sucesseurs : TAS
	 * Lbl R
	 */
	goTAS() {
		console.log('+ GO TAS');
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
		console.log('- GO TAS');
		this.tas(); // Goto T
	},

	/**
	 * Cance
	 * @Prédécesseurs : selecteur
	 * @Sucesseurs : selecteur, TAS
	 * Entouré d'un while 0 pour n'être exécuté que par le label
	 * Lbl A
	 */
	cancel() {
		console.log('+ Cancel');
		if (mat.A[0][0] === 0) {
			console.log('- Cancel');
			return; // Goto S
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
		console.log('- Cancel');
		this.tas(); // Goto T
	},

	/**
	 * Pause
	 * @Prédécesseurs : selecteur
	 * @Sucesseurs : TAS
	 * Lbl P
	 */
	async pause() {
		console.log('+ Pause');
		if (vars.S === 1) {
			vars.S = 0;
		}
		display.clear();
		display.text(55, 115, 'Pause');
		display.text(55, 123, 'Entrée pour reprendre');
		do {
			await waitForNewKey();
		} while (getKey !== 'Enter');
		// Recharger l'affichage
		console.log('- Pause');
		this.tas(); // Goto T
	},

	/**
	 * Auto
	 * @Prédécesseurs : partieSansNom1, selecteur
	 * @Sucesseurs : selecteur, goTAS
	 * Déplace automatiquement les cartes vers le dépôt si possible.
	 * Garde le mode automatique tant qu'il y a des déplacements possibles.
	 * Lbl theta
	 */
	async auto() {
		console.log('+ Auto');
		display.text(1, 120, 'A');
		await sleep(100); // Temps de chargement simulé
		vars.theta = 1;
		for (let A = 1; A <= 12; A++) {
			vars.E = this.tailleColonneCarte(A);
			if (vars.E === 0) continue; // Pas de carte dans la colonne
			vars.C = this.couleurCarte(A, vars.E);
			vars.G = this.valeurCarte(A, vars.E);
			vars.H = this.valeurDepot(vars.C);
			if (vars.G === vars.H + 1) {
				// Goto R
				vars.H++;
				mat.A[0][0]++;
				mat.A[0][mat.A[0][0]] = A;
				mat.A[1][mat.A[0][0]] = vars.C + 12;
				this.effacerCarte(A, vars.E);
			}
		}

		console.log('- Auto');
		return; // Goto S
	},

	/**
	 * Gagne
	 * @Prédécesseurs : TAS
	 * @Sucesseurs : rien
	 * Lbl G
	 */
	gagne() {
		console.log('+ Gagne');
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
		console.log('- Gagne');
		throw new Error('Gagné');
	},

	async main() {
		if (await this.choixCharger()) {
			// Charge la partie en cours
			await this.pause(); // Goto P
		}
		try {
			await this.selecteur();
		} catch (e) {
			if (e.message === 'Gagné') {
				console.log('Gagné');
			} else {
				console.error(e);
			}
		}
	}
}
