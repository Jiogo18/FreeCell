var getKeySpan;
setTimeout(() => {
	display = new DisplayGraphCasioVertical();
	freecell.main();
}, 100);
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