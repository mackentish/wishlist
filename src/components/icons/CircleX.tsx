import React from 'react'

interface CircleXProps {
    disabled?: boolean
}

export function CircleX({ disabled }: CircleXProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className={`w-6 h-6 ${
                disabled
                    ? 'stroke-slate-600'
                    : 'stroke-primary hover:stroke-primaryHover transition-colors duration-200'
            }`}
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
        </svg>
    )
}
