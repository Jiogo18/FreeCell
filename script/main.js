var getKeySpan;
document.addEventListener('DOMContentLoaded', () => {
	const display = new DisplayGraphCasio();
	getKeySpan = document.getElementById('getKey');
});
document.addEventListener('keydown', (e) => {
	getKey = e.key;
	getKeySpan.innerHTML = getKey;
});
document.addEventListener('keyup', (e) => {
	getKey = 0;
	getKeySpan.innerHTML = getKey;
});