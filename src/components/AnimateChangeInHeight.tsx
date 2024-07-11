import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface AnimateChangeInHeightProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimateChangeInHeight({
    children,
    className,
}: AnimateChangeInHeightProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState<number | 'auto'>('auto');

    useEffect(() => {
        if (containerRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                // We only have one entry, so we can use entries[0].
                const observedHeight = entries[0].contentRect.height;
                setHeight(observedHeight);
            });

            resizeObserver.observe(containerRef.current);

            return () => {
                // Cleanup the observer when the component is unmounted
                resizeObserver.disconnect();
            };
        }
    }, []);

    return (
        <motion.div
            className={classNames(className, 'overflow-hidden')}
            style={{ height }}
            animate={{ height }}
            transition={{ duration: 0.1 }}
        >
            <div ref={containerRef}>{children}</div>
        </motion.div>
    );
}
