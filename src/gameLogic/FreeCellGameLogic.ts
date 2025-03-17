import {
	Card,
	cardColorsSelector,
	CardValue,
	GameMove,
	GameState,
	SlotIdentifier,
} from './types';
import Deck from './Deck';

export const boardColumnCount = 8;
export const storageSlotCount = 4;
export const depotSlotCount = 4;

export function generateBoard(seed: number) {
	const board: Card[][] = new Array(boardColumnCount);
	for (let i = 0; i < boardColumnCount; i++) {
		board[i] = [];
	}

	const cards: Deck = Deck.create52CardDeck();
	cards.shuffle(seed);

	while (cards.length !== 0) {
		for (let i = 0; i < boardColumnCount && cards.length !== 0; i++) {
			board[i].push(cards.drawOne());
		}
	}

	return board;
}

export function getCardAtSlot(
	gameState: GameState,
	slot: SlotIdentifier,
): Card | undefined {
	if (slot.category === 'board') {
		const column = slot.index;
		if (column < 0 || column >= boardColumnCount) {
			throw new Error('Invalid slot');
		}
		return gameState.board[column][gameState.board[column].length - 1];
	} else if (slot.category === 'storage') {
		const column = slot.index;
		if (column < 0 || column >= storageSlotCount) {
			throw new Error('Invalid slot');
		}
		return gameState.storage[column];
	} else if (slot.category === 'depot') {
		const column = slot.index;
		if (column < 0 || column >= depotSlotCount) {
			throw new Error('Invalid slot');
		}
		const color = cardColorsSelector[column];
		const value = gameState.depot.get(color);
		if (value === undefined) return undefined;
		return { color, value };
	} else throw new Error('Invalid slot');
}

export function redOrBlack(card: Card) {
	return (card.color === 'heart' || card.color === 'diamond')
		? 'red'
		: 'black';
}

export function isMoveAllowed(gameState: GameState, move: GameMove): boolean {
	const cardFrom = getCardAtSlot(gameState, move.from);
	if (cardFrom === undefined) return false;

	const cardTo = getCardAtSlot(gameState, move.to);

	if (move.to.category === 'depot') {
		const color = cardColorsSelector[move.to.index];
		if (color !== cardFrom.color) return false;
		const value = gameState.depot.get(color) ?? 0;
		return value + 1 === cardFrom.value;
	} else if (move.to.category === 'storage') {
		return cardTo === undefined;
	} else if (move.to.category === 'board') {
		return cardTo === undefined ||
			(cardFrom.value + 1 === cardTo.value &&
				redOrBlack(cardFrom) !== redOrBlack(cardTo));
	} else {
		throw new Error('Invalid slot');
	}
}

export function removeCardFromSlot(
	gameState: GameState,
	slot: SlotIdentifier,
): Card {
	if (slot.category === 'storage') {
		const card = gameState.storage[slot.index];
		gameState.storage[slot.index] = undefined;
		return card!;
	} else if (slot.category === 'depot') {
		const color = cardColorsSelector[slot.index];
		const value = gameState.depot.get(color);
		if (value === undefined) throw new Error('Depot is empty');
		if (value === 1) {
			gameState.depot.delete(color);
		} else {
			gameState.depot.set(color, (value - 1) as CardValue);
		}
		return { color, value };
	} else if (slot.category === 'board') {
		return gameState.board[slot.index].pop()!;
	} else {
		throw new Error('Invalid slot');
	}
}

export function addCardToSlot(
	gameState: GameState,
	slot: SlotIdentifier,
	card: Card,
) {
	if (slot.category === 'storage') {
		gameState.storage[slot.index] = card;
	} else if (slot.category === 'depot') {
		gameState.depot.set(card.color, card.value);
	} else if (slot.category === 'board') {
		gameState.board[slot.index].push(card);
	}
}

export function canMoveToDepot(gameState: GameState, card: Card): boolean {
	const color = card.color;
	const depotValue = gameState.depot.get(color) ?? 0;
	return depotValue + 1 === card.value;
}

export function findMovesToDepot(gameState: GameState): GameMove | undefined {
	// Find in the storage
	for (const card of gameState.storage.filter((card) => card !== undefined)) {
		if (canMoveToDepot(gameState, card)) {
			return {
				from: {
					category: 'storage',
					index: gameState.storage.indexOf(card),
				},
				to: {
					category: 'depot',
					index: cardColorsSelector.indexOf(card.color),
				},
			};
		}
	}

	// Find in the board
	for (let column = 0; column < boardColumnCount; column++) {
		const card =
			gameState.board[column][gameState.board[column].length - 1];
		if (card === undefined) continue;
		if (canMoveToDepot(gameState, card)) {
			return {
				from: { category: 'board', index: column },
				to: {
					category: 'depot',
					index: cardColorsSelector.indexOf(card.color),
				},
			};
		}
	}

	return undefined;
}
