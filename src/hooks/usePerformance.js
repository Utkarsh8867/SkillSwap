import { useEffect, useRef } from 'react';

export function usePerformance(componentName) {
    const renderCount = useRef(0);
    const startTime = useRef(Date.now());

    useEffect(() => {
        renderCount.current += 1;

        if (process.env.NODE_ENV === 'development') {
            console.log(`${componentName} rendered ${renderCount.current} times`);

            // Measure render time
            const endTime = Date.now();
            const renderTime = endTime - startTime.current;

            if (renderTime > 100) {
                console.warn(`${componentName} took ${renderTime}ms to render (slow)`);
            }

            startTime.current = endTime;
        }
    });

    return renderCount.current;
}

export function measurePerformance(fn, label) {
    return async (...args) => {
        const start = performance.now();
        const result = await fn(...args);
        const end = performance.now();

        if (process.env.NODE_ENV === 'development') {
            console.log(`${label} took ${(end - start).toFixed(2)}ms`);
        }

        return result;
    };
}