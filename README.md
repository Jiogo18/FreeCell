# FreeCell

Ce projet est un portage d'un programme réalisé sous CASIO Basic.
Il n'a pas l'objectif d'être performant (JS est déjà 4 millions de fois plus rapide que Basic),
ni d'être agréable à utiliser (il faut aimer le binaire).

Version en ligne sur [jiogo18.github.io/FreeCell](https://jiogo18.github.io/FreeCell/)

## Présentation de l'interface

Chaque case correspond à une carte. Les cartes sont affichées au format binaire :

- Les deux bits à gauche correspondent à la couleur. 0 = pique, 1 = cœur, 2 = carreau, 3 = trèfle (exemple dans la zone de dépôt).
- Les 4 bits suivants correspondent à la valeur de la carte (de 1 à 13) en commençant par le coin supérieur gauche et en allant vers la droite puis sur la deuxième ligne.

Le roi est le carré dans la partie supérieure.

Le dépôt est la zone à droite du roi. L'objectif est d'empiler les cartes de 1 à 13 selon les 4 couleurs Pique, Cœur, Carreau et Trèfle.

La zone temporaire est à gauche du roi. Cette zone permet de poser 4 cartes indépendamment de la valeur ou de la couleur.

Le plateau est composé de 8 colonnes contenant toutes les cartes.
## Contrôles

Certains contrôles ne sont disponibles que dans le premier mode de sélection (un seul curseur visible à l'écran).

- Les flèches directionnelles permettent de déplacer le curseur.
- La touche [EXE] ou [Espace] permet de sélectionner une carte.
- La touche [Échape] permet d'annuler le dernier déplacement.
- La touche [A] permet de déplacer toutes les cartes possibles vers la zone de dépôt automatiquement.
- La touche [S] permet de déplacer la carte actuelle vers la zone de dépôt.
- La touche [0] permet de mettre en pause (legacy, ne fonctionne pas)
- Les touches [1] à [8] permettent de déplacer la carte actuelle vers la colonne correspondante.
- La touche [9] permet de déplacer la carte actuelle vers une case de la zone temporaire (aussi accessible par les flèches)

## Règles du jeu
Le plateau est rempli de 52 cartes.

Le but du jeu est de déplacer toutes les cartes dans la zone de dépôt dans l'ordre croissant.

Le joueur peut déplacer les cartes vers une des 4 zones temporaires à condition que celle-ci soit libre.

Lorsque le joueur effectue des déplacements vers le plateau, plusieurs règles doivent être respectées :

- S'il n'y a pas de carte, le déplacement s'effectue sans autre vérification.
- La valeur de la carte à déplacer doit être directement inférieure à la carte existante. Autrement dit, si le joueur veut placer une carte A sur une carte B, la valeur de A = valeur de B - 1
- Les deux cartes doivent avoir une couleur visuelle opposée (noire vs rouge). Si A est un pique ou un trèfle, alors B doit être un cœur ou un carreau.

## Crédits

Jeu de carte FreeCell porté depuis un programme réalisé en CASIO Basic.

Réalisé par Jérôme L. en 2019, porté en JavaScript en 2024.