import useScript from '../hooks/useScript.ts';
import { getBasePath } from '../utils/basePath.ts';

/**
 * Original code of the CASIO program
 * Freecell
 * Par Jérôme L
 * V 1.1
 * @returns
 */
export default function CASIOSimulation() {
	useScript(`${getBasePath()}/CASIOSimulation/displayGraphCasio.js`, false);
	useScript(`${getBasePath()}/CASIOSimulation/freecell.js`, false);
	useScript(`${getBasePath()}/CASIOSimulation/main.js`, false);
	return (
		<>
			<canvas id='display'></canvas>
		</>
	);
}
