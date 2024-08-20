import { Pages } from '@/types';
import Link from 'next/link';
import React from 'react';
import { FadeIn, Typography, primaryBtnClass } from '.';

export function ErrorView() {
    return (
        <FadeIn className="flex flex-col gap-8 items-center w-full max-w-3xl">
            <Typography type="h5">
                Something went wrong. Please try again later 😞
            </Typography>
            <Link href={Pages.Home} className={primaryBtnClass}>
                Go Home
            </Link>
        </FadeIn>
    );
}
