import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ShareProps {
    disabled?: boolean;
}

export function Share({ disabled }: ShareProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`w-6 h-6 ${
                    disabled
                        ? 'fill-slate-600'
                        : 'fill-primary hover:fill-primaryHover transition-colors duration-200'
                }`}
                data-tooltip-id="share"
                data-tooltip-content="Share this list"
            >
                <path
                    fill-rule="evenodd"
                    d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
                    clip-rule="evenodd"
                />
            </svg>
            <Tooltip id="share" className="font-mono" />
        </>
    );
}
