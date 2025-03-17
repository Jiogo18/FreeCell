import { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { GameMove } from './types';
import {
	addCardToSlot,
	isMoveAllowed,
	removeCardFromSlot,
} from './FreeCellGameLogic';

export function useGameLogic() {
	const { gameState, setGameState } = useContext(GameContext)!;

	function handleMove(move: GameMove) {
		if (isMoveAllowed(gameState, move)) {
			const newGameState = { ...gameState };
			const card = removeCardFromSlot(newGameState, move.from);
			addCardToSlot(newGameState, move.to, card);
			newGameState.moves.push(move);
			setGameState(newGameState);
		}
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

	return {
		gameState,
		handleMove,
		cancelMove,
	};
}
