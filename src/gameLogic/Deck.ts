import createPRNG from './prng.ts';
import { Card, cardColors, cardValues } from './types.ts';

export default class Deck {
	cards: Card[];

	get length() {
		return this.cards.length;
	}

	constructor(cards: Card[]) {
		this.cards = cards;
	}

	static create52CardDeck(): Deck {
		const cards: Card[] = [];
		for (const color of cardColors) {
			for (const value of cardValues) {
				cards.push({ color, value });
			}
		}
		return new Deck(cards);
	}

	shuffle(seed: number) {
		const prng = createPRNG(seed);
		const shuffledCards: Card[] = [];
		while (this.cards.length !== 0) {
			const randomIndex = Math.floor(prng() * this.cards.length);
			const card = this.cards.splice(randomIndex, 1)[0];
			shuffledCards.push(card);
		}
		this.cards = shuffledCards;
	}

	drawOne(): Card {
		return this.cards.splice(0, 1)[0];
	}
}
