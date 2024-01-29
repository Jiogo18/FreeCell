var getKeySpan;
document.addEventListener('DOMContentLoaded', () => {
	display = new DisplayGraphCasioVertical();
	freecell.main();
});
document.addEventListener('keydown', (e) => {
	getKey = e.key;
});
document.addEventListener('keyup', (e) => {
	getKey = 0;
});