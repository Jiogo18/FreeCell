import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
	Card,
	CardColor,
	cardColors,
	cardColorsSelector,
	CardValue,
	SlotIdentifier,
} from '../gameLogic/types.ts';
import './ImageDisplay.css';
import { useGameLogic } from '../gameLogic/useGameLogic.tsx';
import { boardColumnCount } from '../gameLogic/FreeCellGameLogic.ts';
import { getBasePath } from '../utils/basePath.ts';

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCardImage(card: Card) {
	return `${getBasePath()}/cards/${
		capitalize(card.color)
	}/card_${card.value}_${card.color}.png`;
}

function getCardName(card: Card) {
	return `${card.value} ${card.color}`;
}

function CardImage(
	props: { card: Card } & React.DOMAttributes<HTMLImageElement>,
) {
	const { card, ...otherProps } = props;
	return (
		<img
			{...otherProps}
			src={getCardImage(card)}
			alt={getCardName(card)}
			title={getCardName(card)}
			className='card'
		/>
	);
}

function DragDropCardLogic(
	{ slot, children, hasCard }: {
		slot: SlotIdentifier;
		children: ReactNode;
		hasCard: boolean;
	},
) {
	const {
		gameState,
		handleMove,
		handleMoveToDepot,
		setSelectors,
		setCurrentSlot,
	} = useGameLogic();

	const elementActivated = useMemo(
		() =>
			gameState.selection.to !== undefined &&
			gameState.selection.from.category === slot.category &&
			gameState.selection.from.index === slot.index,
		[gameState],
	);

	const [isMobile, setMobile] = useState(false);

	function onMoveStart() {
		setSelectors(slot, { category: 'board', index: 0 });
	}
	function onMoveOver() {
		setCurrentSlot(slot);
	}
	function onMoveEnd() {
		if (gameState.selection.to === undefined) return false;
		handleMove({
			from: gameState.selection.from,
			to: gameState.selection.to,
		});
	}
	function onCardActivated() {
		if (gameState.selection.to === undefined) {
			onMoveStart();
		} else {
			if (
				!handleMove({
					from: gameState.selection.from,
					to: slot,
				})
			) {
				onMoveStart();
			}
		}
	}

	const ref = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (!ref.current || !hasCard) return;
		ref.current.addEventListener('touchmove', (e) => e.preventDefault(), {
			passive: false,
		});
	}, [ref, hasCard]);

	return (
		<div
			ref={ref}
			onDoubleClick={() => handleMoveToDepot(slot, true)}
			onMouseOver={() => setCurrentSlot(slot)}
			onDragStart={onMoveStart}
			onDragOver={onMoveOver}
			onDragEnd={onMoveEnd}
			onClick={isMobile ? undefined : onCardActivated}
			onTouchStart={() => {
				onCardActivated();
				if (!isMobile) setMobile(true);
			}}
			className={elementActivated ? 'selected' : undefined}
		>
			{children}
		</div>
	);
}

function CardDepot(
	{ color, value }: { color: CardColor; value: CardValue | undefined },
) {
	return (
		<DragDropCardLogic
			slot={{
				category: 'depot',
				index: cardColorsSelector.indexOf(color),
			}}
			hasCard={value !== undefined}
		>
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
		</DragDropCardLogic>
	);
}

function CardSlot(
	{ card, depotIndex }: { card: Card | undefined; depotIndex: number },
) {
	return (
		<DragDropCardLogic
			slot={{ category: 'storage', index: depotIndex }}
			hasCard={card !== undefined}
		>
			<div className='card_slot'>
				{card !== undefined && <CardImage card={card} />}
			</div>
		</DragDropCardLogic>
	);
}

function CardColumn(
	{ cards, columnIndex }: { cards: Card[]; columnIndex: number },
) {
	return (
		<DragDropCardLogic
			slot={{ category: 'board', index: columnIndex }}
			hasCard={cards.length > 0}
		>
			<div className='card_column'>
				{cards.map((card, index) => (
					<CardImage key={index} card={card} />
				))}
			</div>
		</DragDropCardLogic>
	);
}

function ImageDisplay() {
	const { gameState } = useGameLogic();

	return (
		<div className='image_display'>
			<div className='freecell_header'>
				<div className='card_storage'>
					{[3, 2, 1, 0].map((index) => (
						<CardSlot
							key={index}
							card={gameState.storage[index]}
							depotIndex={index}
						/>
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
					<CardColumn
						key={columnIndex}
						cards={column}
						columnIndex={boardColumnCount - columnIndex - 1}
					/>
				))}
			</div>
		</div>
	);
}

export default ImageDisplay;
