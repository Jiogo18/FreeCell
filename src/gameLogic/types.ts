export type CardColor = 'heart' | 'diamond' | 'clover' | 'spade';
export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export const cardValues: CardValue[] = [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
];
export const cardColors: CardColor[] = ['heart', 'diamond', 'clover', 'spade'];

export interface Card {
	color: CardColor;
	value: CardValue;
}

export type SlotCategory = 'board' | 'storage' | 'depot';
export interface SlotIdentifier {
	category: SlotCategory;
	index: number;
}

export interface GameMove {
	from: SlotIdentifier;
	to: SlotIdentifier;
}

export interface SelectionState {
	from: SlotIdentifier;
	to: SlotIdentifier | undefined;
}

/**
 * Freecell game state
 */
export interface GameState {
	/**
	 * Seed for the random number generator
	 */
	seed: number;
	/**
	 * 8 columns of cards starting with 6 or 7 cards in each column
	 */
	board: Card[][];
	/**
	 * 4 slots where cards can be stored temporarily
	 */
	storage: (Card | undefined)[];
	/**
	 * 4 slots where cards can be deposited from 1 to 13
	 */
	depot: Map<CardColor, CardValue>;
	/**
	 * History of the moves made in the game
	 */
	moves: GameMove[];
	/**
	 * Selection state by the user
	 */
	selection: SelectionState;
}
