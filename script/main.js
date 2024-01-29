var getKeySpan;
document.addEventListener('DOMContentLoaded', () => {
	display = new DisplayGraphCasioVertical();
	freecell.main();
});
document.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'ArrowUp':
		case 'ArrowDown':
		case 'ArrowLeft':
		case 'ArrowRight':
		case ' ':
			e.preventDefault();
			break;
	}
	getKey = e.key;
});
document.addEventListener('keyup', (e) => {
	getKey = 0;
});