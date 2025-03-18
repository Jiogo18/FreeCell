export function getBasePath() {
	return (import.meta.env.VITE_BASE_PATH ?? '').replace(/\/$/, '');
}
