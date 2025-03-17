import { GameState } from '../gameLogic/types';
import React, { useEffect, useRef } from 'react';
import { CasioContext } from './CasioContext';
import './CasioDisplay.css';
import { useGameLogic } from '../gameLogic/useGameLogic';

type Orientation = 'horizontal' | 'vertical';

interface CasioDisplayProps {
	orientation: Orientation;
}

function drawGameState(context: CasioContext, gameState: GameState) {
	context.clear();
}

function CasioDisplay({ orientation }: CasioDisplayProps) {
	const { gameState } = useGameLogic();

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const displayContext = React.useMemo(() => {
		if (!canvasRef.current) return;
		const context = canvasRef.current.getContext('2d');
		if (!context) return;
		return new CasioContext(context);
	}, [canvasRef]);

	useEffect(() => {
		if (!displayContext) return;
		drawGameState(displayContext, gameState);
	}, [displayContext]);

	return (
		<canvas
			ref={canvasRef}
			className='casio_display'
			height={orientation === 'horizontal' ? 64 : 128}
			width={orientation === 'horizontal' ? 128 : 64}
		/>
	);
}

export default CasioDisplay;
