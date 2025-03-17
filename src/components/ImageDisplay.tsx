import React from 'react';
import { Card } from '../gameLogic/types';
import './ImageDisplay.css';
import { useGameLogic } from '../gameLogic/useGameLogic';

interface ImageDisplayProps {
}

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCardImage(card: Card) {
	return `/cards/${
		capitalize(card.color)
	}/card_${card.value}_${card.color}.png`;
}

function getCardName(card: Card) {
	return `${card.value} ${card.color}`;
}

function ImageDisplay({}: ImageDisplayProps) {
	const { gameState } = useGameLogic();

	return (
		<div className='image_display'>
			{gameState.board.map((column) =>
				column.map((card) => (
					<img
						key={`${card.color}-${card.value}`}
						src={getCardImage(card)}
						alt={getCardName(card)}
						className={'card'}
					/>
				))
			)}
		</div>
	);
}

export default ImageDisplay;
