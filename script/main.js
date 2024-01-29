var getKeySpan;
document.addEventListener('DOMContentLoaded', () => {
	display = new DisplayGraphCasioVertical();
	getKeySpan = document.getElementById('getkey');
	freecell.main();
});
document.addEventListener('keydown', (e) => {
	getKey = e.key;
	getKeySpan.innerHTML = getKey;
});
document.addEventListener('keyup', (e) => {
	getKey = 0;
	getKeySpan.innerHTML = getKey;
});