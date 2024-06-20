import { useEffect, useRef } from 'react';

const useDebouncedEffect = (effect, deps, delay) => {
    const callback = useRef();
    useEffect(() => {
        callback.current = effect;
    }, [effect]);

    useEffect(() => {
        if (!delay) return;
        const handler = setTimeout(() => callback.current(), delay);
        return () => clearTimeout(handler);
    }, [...deps || [], delay]);
};

export default useDebouncedEffect;