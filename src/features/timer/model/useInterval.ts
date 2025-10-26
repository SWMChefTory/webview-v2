import { useRef, useEffect } from "react";
function useInterval(callback: () => void, delay: number| null) {
	const savedCallback = useRef<() => void>(callback);

    useEffect(() => {
    	savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
    		savedCallback.current();
    	}

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);

    return callback;
}

export default useInterval;