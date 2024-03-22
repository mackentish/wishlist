import Link from 'next/link';
import React from 'react';

interface EmailTemplateProps {
    ownerName: string;
    userName: string;
    listName: string;
}

export function EmailTemplate({
    ownerName,
    userName,
    listName,
}: EmailTemplateProps) {
    return (
        <div className="flex flex-col gap-4 p-4 rounded bg-white dark:bg-black">
            <h1 className="font-bold text-3xl text-black dark:text-white">
                Congrats, {userName}!
            </h1>
            <p className="text-xl text-black dark:text-white">
                {ownerName} has shared their {listName} list with you! Go to
                your{' '}
                <Link href={process.env.NEXT_PUBLIC_SITE_URL as string}>
                    wishlist home page
                </Link>{' '}
                to view it now.
            </p>
        </div>
    );
}
