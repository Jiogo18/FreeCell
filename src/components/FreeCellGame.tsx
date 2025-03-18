import ImageDisplay from './ImageDisplay.tsx';
import CasioDisplay from './CasioDisplay.tsx';
import { useGameLogic } from '../gameLogic/useGameLogic.tsx';
import { GameProvider } from '../context/GameContext.tsx';
import './FreeCellGame.css';

function FreeCellDashboard() {
	const { cancelMove, handleAuto } = useGameLogic();
	return (
		<div className='frecell_dashboard'>
			<button onClick={cancelMove} type='button'>Cancel</button>
			<button onClick={handleAuto} type='button'>Auto</button>
		</div>
	);
}

export default function FreeCellGame() {
	return (
		<div className='freecell_game'>
			<GameProvider>
				<CasioDisplay orientation='vertical' />
				<ImageDisplay />
				<FreeCellDashboard />
			</GameProvider>
		</div>
	);
}
