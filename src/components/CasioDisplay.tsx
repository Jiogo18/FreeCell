import {
	Card,
	cardColors,
	GameState,
	SlotIdentifier,
} from '../gameLogic/types';
import React, { useEffect, useRef } from 'react';
import { CasioContext, VerticalCasioContext } from './CasioContext';
import './CasioDisplay.css';
import { useGameLogic } from '../gameLogic/useGameLogic';
import { boardColumnCount } from '../gameLogic/FreeCellGameLogic';

type Orientation = 'horizontal' | 'vertical';

interface CasioDisplayProps {
	orientation: Orientation;
}

function drawBackground(display: CasioContext) {
	for (let y = 7; y <= 55; y += 6) display.fline(20, y, 100, y);
	for (let x = 20; x <= 100; x += 5) display.fline(x, 7, x, 55);

	display.text(29, 11, '#'); // Le roi de FreeCell
	for (let y = 4; y <= 58; y += 6) {
		display.fline(9, y, 15, y);
	}
	// Couleur des cartes dans le dépôt (en haut à droite)
	display.pixelOn(14, 11);
	display.pixelOn(20, 12);
	display.pixelOn(26, 11);
	display.pixelOn(26, 12);
}

function drawCardValueAtPosition(
	display: CasioContext,
	x: number,
	y: number,
	value: number,
) {
	if (value & 8) {
		display.pixelOn(x, y);
	} else {
		display.pixelOff(x, y);
	}

	if (value & 4) {
		display.pixelOn(x + 1, y);
	} else {
		display.pixelOff(x + 1, y);
	}

	if (value & 2) {
		display.pixelOn(x, y - 1);
	} else {
		display.pixelOff(x, y - 1);
	}

	if (value & 1) {
		display.pixelOn(x + 1, y - 1);
	} else {
		display.pixelOff(x + 1, y - 1);
	}
}

function drawCardAtPosition(
	display: CasioContext,
	card: Card,
	x: number,
	y: number,
) {
	// Corner to indicate the presence of a card
	display.pixelOn(x - 1, y - 2);

	// Red or black depending on the color
	if (card.color === 'heart' || card.color === 'diamond') {
		display.setColor('red');
	}
	// Binary display of the color
	if (card.color === 'diamond' || card.color === 'clover') {
		display.pixelOn(x + 2, y);
	}
	if (card.color === 'heart' || card.color === 'clover') {
		display.pixelOn(x + 2, y - 1);
	}
	// Binary display of the value
	drawCardValueAtPosition(display, x, y, card.value);

	display.setColor('black');
}

function drawCardInSlot(
	gameState: GameState,
	context: CasioContext,
	card: Card,
	slot: SlotIdentifier,
) {
	if (slot.category === 'board') {
		const row = gameState.board[slot.index].indexOf(card);
		drawCardAtPosition(context, card, slot.index * 6 + 9, row * 5 + 23);
	} else if (slot.category === 'storage') {
		drawCardAtPosition(context, card, slot.index * 6 + 36, 12);
	} else if (slot.category === 'depot') {
		drawCardValueAtPosition(context, slot.index * 6 + 38, 12, card.value);
	}
}

function eraseLastInSlot(
	gameState: GameState,
	context: CasioContext,
	slot: SlotIdentifier,
) {
	if (slot.category === 'board') {
		const columnSize = gameState.board[slot.index]?.length;
		if (columnSize === undefined) throw new Error('Invalid slot');
		context.text(slot.index * 6 + 2, columnSize * 5 + 16, ' ');
		for (let z = 1; z <= 5; z++) {
			context.pixelOn(slot.index * 6 + 7, columnSize * 5 + 15 + z);
		}
	} else if (slot.category === 'depot') {
		context.text(slot.index * 6 + 29, 10, ' ');
		for (let z = 1; z <= 5; z++) {
			context.pixelOn(slot.index * 6 + 34, 9 + z);
		}
	}
}

function drawGameState(context: CasioContext, gameState: GameState) {
	context.clear();
	drawBackground(context);

	// Draw the board
	for (let column = 0; column < boardColumnCount; column++) {
		for (const card of gameState.board[column]) {
			if (card === undefined) continue;
			drawCardInSlot(gameState, context, card, {
				category: 'board',
				index: column,
			});
		}
	}

	// Draw the storage
	for (let index = 0; index < 4; index++) {
		const card = gameState.storage[index];
		if (card === undefined) continue;
		drawCardInSlot(gameState, context, card, {
			category: 'storage',
			index,
		});
	}

	// Draw the depot
	for (const [color, value] of gameState.depot) {
		const index = cardColors.indexOf(color);
		drawCardInSlot(gameState, context, { color, value }, {
			category: 'depot',
			index,
		});
	}
}

function CasioDisplay({ orientation }: CasioDisplayProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	let displayContext: CasioContext | undefined;
	useEffect(() => {
		if (!canvasRef.current) return;
		const context = canvasRef.current.getContext('2d');
		if (!context) return;
		displayContext = orientation === 'horizontal'
			? new CasioContext(context)
			: new VerticalCasioContext(context);
	}, [canvasRef, orientation]);

	const { gameState } = useGameLogic();

	useEffect(() => {
		if (!displayContext) return;
		drawGameState(displayContext, gameState);
	}, [displayContext, gameState]);

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
