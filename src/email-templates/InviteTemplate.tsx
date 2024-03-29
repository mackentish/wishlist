import Link from 'next/link';
import React from 'react';

interface InviteTemplateProps {
    ownerName: string;
    listName: string;
}

export function InviteTemplate({ ownerName, listName }: InviteTemplateProps) {
    return (
        <div className="flex flex-col gap-4 p-4 rounded bg-white dark:bg-black">
            <h1 className="font-bold text-3xl text-black dark:text-white">
                Congrats!
            </h1>
            <p className="text-xl text-black dark:text-white">
                {ownerName} has shared their {listName} list with you! Go to{' '}
                <Link href={process.env.NEXT_PUBLIC_SITE_URL as string}>
                    wishlist
                </Link>{' '}
                to sign up and view it now.
            </p>
        </div>
    );
}
