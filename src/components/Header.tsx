import React from 'react';

export function Header() {
    return (
        <header className="flex flex-row gap-2 items-baseline justify-center w-full py-8 mb-8">
            <h1 className="font-bold text-5xl text-black dark:text-white">
                wishlist
            </h1>
            <p className="text-xs text-black dark:text-white">by @mackentish</p>
        </header>
    );
}
