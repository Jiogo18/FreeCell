import { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { cardColorsSelector, GameMove, SlotIdentifier } from './types';
import {
	addCardToSlot,
	canMoveToDepot,
	findMovesToDepot,
	getCardAtSlot,
	isMoveAllowed,
	removeCardFromSlot,
} from './FreeCellGameLogic';

export function useGameLogic() {
	const { gameState, setGameState } = useContext(GameContext)!;

	function handleMove(move: GameMove) {
		const newGameState = { ...gameState };
		if (isMoveAllowed(gameState, move)) {
			const card = removeCardFromSlot(newGameState, move.from);
			addCardToSlot(newGameState, move.to, card);
			newGameState.moves.push(move);
		}
		newGameState.selection = {
			from: { category: 'board', index: 0 },
			to: undefined,
		};
		setGameState(newGameState);
	}

	function cancelMove() {
		const newGameState = { ...gameState };
		const move = newGameState.moves.pop();
		if (move !== undefined) {
			const card = removeCardFromSlot(newGameState, move.to);
			addCardToSlot(newGameState, move.from, card);
			setGameState(newGameState);
		}
	}

	function setSelectors(from: SlotIdentifier, to?: SlotIdentifier) {
		setGameState({ ...gameState, selection: { from, to } });
	}

	function getNextSlot(slot: SlotIdentifier): SlotIdentifier {
		const index = slot.index + 1;
		if (slot.category === 'board') {
			if (index < 8) return { category: 'board', index };
			else return { category: 'storage', index: 0 };
		} else if (slot.category === 'storage') {
			if (index < 4) return { category: 'storage', index };
			else return { category: 'depot', index: 0 };
		} else if (slot.category === 'depot') {
			if (index < 4) return { category: 'depot', index };
			else return { category: 'board', index: 0 };
		} else throw new Error('Invalid slot');
	}
	function getPreviousSlot(slot: SlotIdentifier): SlotIdentifier {
		const index = slot.index - 1;
		if (slot.category === 'board') {
			if (index >= 0) return { category: 'board', index };
			else return { category: 'depot', index: 3 };
		} else if (slot.category === 'storage') {
			if (index >= 0) return { category: 'storage', index };
			else return { category: 'board', index: 7 };
		} else if (slot.category === 'depot') {
			if (index >= 0) return { category: 'depot', index };
			else return { category: 'storage', index: 3 };
		} else throw new Error('Invalid slot');
	}

	function getCurrentSlot(): SlotIdentifier {
		if (gameState.selection.to !== undefined) {
			return gameState.selection.to;
		} else {
			return gameState.selection.from;
		}
	}

	function setCurrentSlot(slot: SlotIdentifier) {
		if (gameState.selection.to !== undefined) {
			setSelectors(gameState.selection.from, slot);
		} else {
			setSelectors(slot, undefined);
		}
	}

	function moveSelectorRelative(direction: 'left' | 'right') {
		if (direction === 'left') {
			setCurrentSlot(getNextSlot(getCurrentSlot()));
		} else {
			setCurrentSlot(getPreviousSlot(getCurrentSlot()));
		}
	}

	function moveSelectorAbsolute(index: number) {
		if (index < 0 || index > 16) throw new Error('Invalid slot');
		const slot: SlotIdentifier =
			index < 8 && { category: 'board', index } ||
			index < 12 && { category: 'storage', index: index - 8 } ||
			{ category: 'depot', index: index - 12 };
		setCurrentSlot(slot);
	}

	function handleAuto() {
		var move: GameMove | undefined;
		while (move = findMovesToDepot(gameState)) {
			handleMove(move);
		}
	}

	function handleMoveToDepot(slot: SlotIdentifier) {
		const card = getCardAtSlot(gameState, slot);
		if (card === undefined) return;
		if (canMoveToDepot(gameState, card)) {
			handleMove({
				from: slot,
				to: {
					category: 'depot',
					index: cardColorsSelector.indexOf(card.color),
				},
			});
		}
	}

	return {
		gameState,
		handleMove,
		cancelMove,
		handleAuto,
		handleMoveToDepot,
		setSelectors,
		setCurrentSlot,
		getCurrentSlot,
		moveSelectorRelative,
		moveSelectorAbsolute,
	};
}
