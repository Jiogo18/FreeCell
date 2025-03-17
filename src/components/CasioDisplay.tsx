import {
	Card,
	cardColors,
	GameState,
	SlotIdentifier,
} from '../gameLogic/types';
import React, { useEffect, useRef, useState } from 'react';
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

	// Draw the selectors
	if (gameState.selection.from.category === 'board') {
		context.text(gameState.selection.from.index * 6 + 8, 105, '>');
	} else if (gameState.selection.from.category === 'depot') {
		context.text(gameState.selection.from.index * 6 + 5, 4, '<');
	} else if (gameState.selection.from.category === 'storage') {
		context.text(gameState.selection.from.index * 6 + 35, 4, '<');
	}
	if (gameState.selection.to !== undefined) {
		if (gameState.selection.to.category === 'board') {
			context.text(gameState.selection.to.index * 6 + 8, 110, '<');
		} else if (gameState.selection.to.category === 'depot') {
			context.text(gameState.selection.to.index * 6 + 5, 1, '>');
		} else if (gameState.selection.to.category === 'storage') {
			context.text(gameState.selection.to.index * 6 + 35, 1, '>');
		}
	}
}

function CasioDisplay({ orientation }: CasioDisplayProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [displayContext, setDisplayContext] = useState<
		CasioContext | undefined
	>(undefined);
	useEffect(() => {
		if (!canvasRef.current) return;
		const context = canvasRef.current.getContext('2d');
		if (!context) return;
		if (orientation === 'horizontal') {
			setDisplayContext(new CasioContext(context));
		} else setDisplayContext(new VerticalCasioContext(context));
	}, [canvasRef, orientation]);

	const {
		gameState,
		handleMove,
		setSelectors,
		moveSelectorRelative,
		moveSelectorAbsolute,
	} = useGameLogic();

	useEffect(() => {
		if (!displayContext) return;
		drawGameState(displayContext, gameState);
	}, [displayContext, gameState]);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			switch (e.key) {
				case 'ArrowUp':
				case 'ArrowRight':
					moveSelectorRelative('right');
					e.preventDefault();
					break;
				case 'ArrowDown':
				case 'ArrowLeft':
					moveSelectorRelative('left');
					e.preventDefault();
					break;
				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
					moveSelectorAbsolute(parseInt(e.key));
					break;
				case 'Enter':
				case ' ':
					if (gameState.selection.to === undefined) {
						setSelectors(
							gameState.selection.from,
							{ category: 'board', index: 0 } as SlotIdentifier,
						);
					} else {
						handleMove({
							from: gameState.selection.from,
							to: gameState.selection.to,
						});
					}
					e.preventDefault();
					break;
			}
		}

		document.body.addEventListener('keydown', handleKeyDown);
		return () => {
			document.body.removeEventListener('keydown', handleKeyDown);
		};
	}, [gameState]);

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
