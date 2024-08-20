import React from 'react';

interface TypographyProps {
    children: React.ReactNode;
    type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
    classOverride?: string;
}

export function Typography({
    children,
    type,
    classOverride = '',
}: TypographyProps) {
    const baseClass = 'text-black dark:text-white';

    if (type === 'h1') {
        return (
            <h1 className={`text-5xl font-bold ${baseClass} ${classOverride}`}>
                {children}
            </h1>
        );
    } else if (type === 'h2') {
        return (
            <h2 className={`text-4xl font-bold ${baseClass} ${classOverride}`}>
                {children}
            </h2>
        );
    } else if (type === 'h3') {
        return (
            <h3 className={`text-3xl font-bold ${baseClass} ${classOverride}`}>
                {children}
            </h3>
        );
    } else if (type === 'h4') {
        return (
            <h4 className={`text-2xl font-bold ${baseClass} ${classOverride}`}>
                {children}
            </h4>
        );
    } else if (type === 'h5') {
        return (
            <h5 className={`text-xl font-bold ${baseClass} ${classOverride}`}>
                {children}
            </h5>
        );
    } else if (type === 'h6') {
        return (
            <h6 className={`text-lg font-bold ${baseClass} ${classOverride}`}>
                {children}
            </h6>
        );
    } else {
        return (
            <p className={[baseClass, classOverride].join(' ')}>{children}</p>
        );
    }
}
