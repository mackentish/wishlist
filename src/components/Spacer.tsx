import React from 'react';

interface SpacerProps {
    /** This number should match up with ones allows by Tailwind:
     * https://tailwindcss.com/docs/height
     */
    height?: number;
}

export function Spacer({ height = 4 }: SpacerProps) {
    return <div className={`h-${height} w-full`}></div>;
}
