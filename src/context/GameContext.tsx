import React, {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useMemo,
	useState,
} from 'react';
import { GameState } from '../gameLogic/types';
import { genSeed } from '../gameLogic/prng';
import { generateBoard } from '../gameLogic/FreeCellGameLogic';

interface GameContextProps {
	gameState: GameState;
	setGameState: Dispatch<SetStateAction<GameState>>;
}

export const GameContext = createContext<GameContextProps | undefined>(
	undefined,
);

interface GameProviderProps {
	children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
	const seed = useMemo(() => genSeed(), []);

	const [gameState, setGameState] = useState<GameState>({
		seed,
		board: generateBoard(seed),
		storage: [],
		depot: new Map(),
		moves: [],
		selection: { from: { category: 'board', index: 0 }, to: undefined },
	});

	return (
		<GameContext.Provider value={{ gameState, setGameState }}>
			{children}
		</GameContext.Provider>
	);
}
