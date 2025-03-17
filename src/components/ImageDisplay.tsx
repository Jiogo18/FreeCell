import React from 'react';
import { Card, CardColor, cardColors, CardValue } from '../gameLogic/types';
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

function CardImage({ card }: { card: Card }) {
	return (
		<img
			src={getCardImage(card)}
			alt={getCardName(card)}
			className={'card'}
		/>
	);
}

function CardDepot(
	{ color, value }: { color: CardColor; value: CardValue | undefined },
) {
	return (
		<div className='card_slot'>
			{value !== undefined
				? <CardImage card={{ color, value: value! }} />
				: (
					<span>
						{[
							'\u2660',
							'\u2665',
							'\u2666',
							'\u2663',
						][cardColors.indexOf(color)]}
					</span>
				)}
		</div>
	);
}

function ImageDisplay({}: ImageDisplayProps) {
	const { gameState } = useGameLogic();

	return (
		<div className='image_display'>
			<div className='freecell_header'>
				<div className='card_storage'>
					{[3, 2, 1, 0].map((index) => (
						<div key={index} className='card_slot'>
							{gameState.storage[index] !== undefined &&
								(
									<CardImage
										key={index}
										card={gameState.storage[index]!}
									/>
								)}
						</div>
					))}
				</div>
				<span>&#x25A0;</span>
				<div className='card_depot'>
					{cardColors.map((color, index) => (
						<CardDepot
							key={index}
							color={color}
							value={gameState.depot.get(color)}
						/>
					))}
				</div>
			</div>
			<div className='card_board'>
				{[...gameState.board].reverse().map((column, columnIndex) => (
					<div key={columnIndex} className='card_column'>
						{column.map((card) => (
							<CardImage
								key={`${card.color}-${card.value}`}
								card={card}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

export default ImageDisplay;
