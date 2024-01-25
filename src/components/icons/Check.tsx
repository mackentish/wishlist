import React from 'react';

interface CheckProps {
    style?: string;
}

export function Check({ style = 'stroke-white' }: CheckProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className={`w-4 h-4 stroke-[4px] ${style}`}
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
            />
        </svg>
    );
}
