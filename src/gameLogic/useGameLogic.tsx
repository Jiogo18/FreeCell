import { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { GameMove, SlotIdentifier } from './types';
import {
	addCardToSlot,
	findMovesToDepot,
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

	function moveSelectorRelative(direction: 'left' | 'right') {
		if (gameState.selection.to !== undefined) {
			if (direction === 'left') {
				setSelectors(
					gameState.selection.from,
					getNextSlot(gameState.selection.to),
				);
			} else {
				setSelectors(
					gameState.selection.from,
					getPreviousSlot(gameState.selection.to),
				);
			}
		} else if (direction === 'left') {
			setSelectors(getNextSlot(gameState.selection.from), undefined);
		} else {
			setSelectors(getPreviousSlot(gameState.selection.from), undefined);
		}
	}

	function moveSelectorAbsolute(index: number) {
		if (index < 0 || index > 16) throw new Error('Invalid slot');
		const slot: SlotIdentifier =
			index < 8 && { category: 'board', index } ||
			index < 12 && { category: 'storage', index: index - 8 } ||
			{ category: 'depot', index: index - 12 };
		if (gameState.selection.to !== undefined) {
			setSelectors(gameState.selection.from, slot);
		} else {
			setSelectors(slot, undefined);
		}
	}

	function handleAuto() {
		var move: GameMove | undefined;
		while (move = findMovesToDepot(gameState)) {
			handleMove(move);
		}
	}

	return {
		gameState,
		handleMove,
		cancelMove,
		handleAuto,
		setSelectors,
		moveSelectorRelative,
		moveSelectorAbsolute,
	};
}
