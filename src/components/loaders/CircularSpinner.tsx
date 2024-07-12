import { motion } from 'framer-motion';
import React from 'react';

export function CircularSpinner({ size = 30 }: { size?: number }) {
    const spinnerVariants = {
        animate: {
            rotate: [0, 360],
            transition: {
                duration: 1,
                ease: 'linear',
                repeat: Infinity,
            },
        },
    };

    const circleVariants = {
        initial: {
            opacity: 0.6,
        },
        animate: {
            opacity: [0.6, 1, 0.6],
            transition: {
                duration: 1,
                ease: 'easeInOut',
                repeat: Infinity,
            },
        },
    };

    return (
        <motion.div>
            <motion.div
                variants={spinnerVariants}
                animate="animate"
                className="border-4 border-solid border-gray-300 border-t-primary rounded-full"
                style={{
                    width: size,
                    height: size,
                    boxSizing: 'border-box',
                }}
            >
                <motion.div
                    variants={circleVariants}
                    initial="initial"
                    animate="animate"
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'transparent',
                    }}
                />
            </motion.div>
        </motion.div>
    );
}
