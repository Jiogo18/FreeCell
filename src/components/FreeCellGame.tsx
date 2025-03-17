import React from 'react';
import ImageDisplay from './ImageDisplay';
import CasioDisplay from './CasioDisplay';
import { useGameLogic } from '../gameLogic/useGameLogic';
import { GameProvider } from '../context/GameContext';
import './FreeCellGame.css';

function FreeCellDashboard() {
	const { cancelMove, handleAuto } = useGameLogic();
	return (
		<div className='frecell_dashboard'>
			<button onClick={cancelMove}>Cancel</button>
			<button onClick={handleAuto}>Auto</button>
		</div>
	);
}

export default function FreeCellGame() {
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
