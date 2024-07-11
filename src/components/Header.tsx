import React from 'react';

export function Header() {
    return (
        <header className="flex flex-row gap-2 items-baseline justify-center w-full p-8">
            <h1 className="font-bold text-5xl text-black dark:text-white">
                wishlist
            </h1>
            <p className="text-xs text-gray700 dark:text-gray300 ">
                by @mackentish
            </p>
        </header>
    );
}
