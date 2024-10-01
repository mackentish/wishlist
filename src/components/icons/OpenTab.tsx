import React from 'react';
import { Tooltip } from 'react-tooltip';

interface OpenTabProps {
    disabled?: boolean;
}

export function OpenTab({ disabled = false }: OpenTabProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className={`w-6 h-6 ${disabled ? 'stroke-gray-700 dark:stroke-gray-300' : 'stroke-primary-500'}`}
                data-tooltip-id="open-tab"
                data-tooltip-content={
                    disabled ? 'No link available' : 'Open link in new tab'
                }
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
            </svg>
            <Tooltip id="open-tab" />
        </>
    );
}
