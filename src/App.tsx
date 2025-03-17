import React from 'react';
import './App.css';
import FreeCellGame from './components/FreeCellGame';
import CASIOSimulation from './CASIOSimulation/main';

function App() {
	return (
		<>
			<h1>Freecell</h1>
			{document.location.pathname.endsWith('CASIOSimulation')
				? (
					<>
						<p>
							Ported from{' '}
							<a href='https://github.com/Jiogo18/FreeCell/blob/main/CASIO/FREECELL.G1M.txt'>
								FREECELL.G1M
							</a>
						</p>
						<CASIOSimulation />
						<a href='../'>Try the React version</a>
					</>
				)
				: (
					<>
						<FreeCellGame />
						<a href='CASIOSimulation'>Try the CASIO simulation</a>
					</>
				)}

			<div>
				<h2>Présentation de l'interface</h2>
				<p>
					Chaque case correspond à une carte. Les cartes sont
					affichées au format binaire :
				</p>
				<ul>
					<li>
						Les deux bits à gauche correspondent à la couleur. 0 =
						pique, 1 = cœur, 2 = carreau, 3 = trèfle (exemple dans
						la zone de dépôt).
					</li>
					<li>
						Les 4 bits suivants correspondent à la valeur de la
						carte (de 1 à 13) en commençant par le coin supérieur
						gauche et en allant vers la droite puis sur la deuxième
						ligne.
					</li>
				</ul>
				<p>Le roi est le carré dans la partie supérieure.</p>
				<p>
					Le dépôt est la zone à droite du roi. L'objectif est
					d'empiler les cartes de 1 à 13 selon les 4 couleurs Pique,
					Cœur, Carreau et Trèfle.
				</p>
				<p>
					La zone temporaire est à gauche du roi. Cette zone permet de
					poser 4 cartes indépendamment de la valeur ou de la couleur.
				</p>
				<p>
					Le plateau est composé de 8 colonnes contenant toutes les
					cartes.
				</p>
			</div>
			<div>
				<h2>Contrôles</h2>
				Certains contrôles ne sont disponibles que dans le premier mode
				de sélection (un seul curseur visible à l'écran).
				<ul>
					<li>
						Les flèches directionnelles permettent de déplacer le
						curseur.
					</li>
					<li>
						La touche [EXE] ou [Espace] permet de sélectionner une
						carte.
					</li>
					<li>
						La touche [Échape] permet d'annuler le dernier
						déplacement.
					</li>
					<li>
						La touche [A] permet de déplacer toutes les cartes
						possibles vers la zone de dépôt automatiquement.
					</li>
					<li>
						La touche [D] permet de déplacer la carte actuelle vers
						la zone de dépôt.
					</li>
					<li>
						La touche [S] permet de déplacer la carte actuelle vers
						la zone de dépôt, vers une colonne ou vers la zone de
						stockage.
					</li>
					<li>
						La touche [P] permet de mettre en pause (legacy, ne
						fonctionne pas).
					</li>
					<li>
						Les touches [1] à [8] permettent de déplacer le curseur
						vers la colonne correspondante.
					</li>
					<li>
						La touche [9] permet de déplacer le curseur une case de
						la zone temporaire (aussi accessible par les flèches).
					</li>
					<li>
						La touche [0] permet de déplacer le curseur vers la zone
						de dépôt.
					</li>
				</ul>
			</div>
			<div>
				<h2>Règles du jeu</h2>
				<p>Le plateau est rempli de 52 cartes.</p>
				<p>
					Le but du jeu est de déplacer toutes les cartes dans la zone
					de dépôt dans l'ordre croissant.
				</p>
				<p>
					Le joueur peut déplacer les cartes vers une des 4 zones
					temporaires à condition que celle-ci soit libre.
				</p>
				<p>
					Lorsque le joueur effectue des déplacements vers le plateau,
					plusieurs règles doivent être respectées :
				</p>
				<ul>
					<li>
						S'il n'y a pas de carte, le déplacement s'effectue sans
						autre vérification.
					</li>
					<li>
						La valeur de la carte à déplacer doit être directement
						inférieure à la carte existante. Autrement dit, si le
						joueur veut placer une carte A sur une carte B, la
						valeur de A = valeur de B - 1
					</li>
					<li>
						Les deux cartes doivent avoir une couleur visuelle
						opposée (noire vs rouge). Si A est un pique ou un
						trèfle, alors B doit être un cœur ou un carreau.
					</li>
				</ul>
			</div>
			<div>
				<h2>Crédits</h2>
				<p>
					Jeu de carte FreeCell porté depuis un programme réalisé en
					CASIO Basic.
				</p>
				<p>
					Réalisé par Jérôme L. en 2019, porté en JavaScript en 2024.
				</p>
				<p>Sources https://github.com/Jiogo18/FreeCell</p>
			</div>
		</>
	);
}

export default App;
