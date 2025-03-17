import { useEffect, useRef } from 'react';

function useScript(url: string, canBeRemoved: boolean = true) {
	const loaded = useRef(false);

	useEffect(() => {
		// Cannot be re-added (prevent strict mode error)
		if (!canBeRemoved && loaded.current) return;

		const script = document.createElement('script');

		script.src = url;
		script.async = true;

		document.body.appendChild(script);

		loaded.current = true;

		return canBeRemoved
			? () => {
				document.body.removeChild(script);
			}
			: undefined;
	}, [url]);
}

export default useScript;
