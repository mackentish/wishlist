import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ShareProps {
    disabled?: boolean;
    tooltip?: boolean;
    classOverride?: string;
}

export function Share({
    disabled = false,
    tooltip = true,
    classOverride = '',
}: ShareProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={[
                    'w-6 h-6',
                    classOverride
                        ? classOverride
                        : disabled
                          ? 'fill-slate-600'
                          : 'fill-primary-500 hover:fill-primary-600 transition-colors duration-200',
                ].join(' ')}
                data-tooltip-id={tooltip ? 'share' : undefined}
                data-tooltip-content={tooltip ? 'Share this list' : undefined}
            >
                <path d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" />
            </svg>
            {tooltip && <Tooltip id="share" />}
        </>
    );
}
