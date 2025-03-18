import useScript from '../hooks/useScript.ts';

/**
 * Original code of the CASIO program
 * Freecell
 * Par Jérôme L
 * V 1.1
 * @returns
 */
export default function CASIOSimulation() {
	useScript('CASIOSimulation/displayGraphCasio.js', false);
	useScript('CASIOSimulation/freecell.js', false);
	useScript('CASIOSimulation/main.js', false);
	return (
		<>
			<canvas id='display'></canvas>
		</>
	);
}
