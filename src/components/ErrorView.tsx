import { Pages } from '@/types';
import Link from 'next/link';
import React from 'react';
import { FadeIn, primaryBtnClass } from '.';

export function ErrorView() {
    return (
        <FadeIn className="flex flex-col gap-8 items-center w-full max-w-3xl">
            <p className="text-xl text-black dark:text-white">
                Something went wrong. Please try again later 😞
            </p>
            <Link href={Pages.Home} className={primaryBtnClass}>
                Go Home
            </Link>
        </FadeIn>
    );
}
