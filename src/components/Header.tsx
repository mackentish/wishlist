import React from 'react';
import { Typography } from '.';

export function Header() {
    return (
        <header className="flex flex-row gap-2 items-baseline justify-center w-full py-8 mb-8">
            <Typography type="h1">wishlist</Typography>
            <Typography type="p" classOverride="text-xs">
                by @mackentish
            </Typography>
        </header>
    );
}
