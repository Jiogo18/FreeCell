function splitmix32(a: number) {
	return function () {
		a |= 0;
		a = a + 0x9e3779b9 | 0;
		let t = a ^ a >>> 16;
		t = Math.imul(t, 0x21f0aaad);
		t = t ^ t >>> 15;
		t = Math.imul(t, 0x735a2d97);
		return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
	};
}

export function genSeed() {
	return (Math.random() * 2 ** 32) >>> 0;
}

export function createPRNG(seed: number = genSeed()) {
	return splitmix32(seed);
}

export default createPRNG;
