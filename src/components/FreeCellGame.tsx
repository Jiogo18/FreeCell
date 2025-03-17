import React from 'react';
import ImageDisplay from './ImageDisplay';
import CasioDisplay from './CasioDisplay';
import { useGameLogic } from '../gameLogic/useGameLogic';
import { GameProvider } from '../context/GameContext';
import './FreeCellGame.css';

function FreeCellDashboard() {
	const { cancelMove } = useGameLogic();
	return (
		<div>
			<button onClick={cancelMove}>Cancel</button>
		</div>
	);
}

export default function FreeCellGame2() {
	return (
		<div className='freecell_game'>
			<GameProvider>
				<CasioDisplay orientation={'vertical'} />
				<ImageDisplay />
				<FreeCellDashboard />
			</GameProvider>
		</div>
	);
}
