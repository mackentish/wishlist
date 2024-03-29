import {
    Container,
    Head,
    Heading,
    Link,
    Tailwind,
    Text,
} from '@react-email/components';
import React from 'react';

interface ShareTemplateProps {
    ownerName: string;
    userName: string;
    listName: string;
}

export function ShareTemplate({
    ownerName,
    userName,
    listName,
}: ShareTemplateProps) {
    return (
        <Tailwind>
            <Head>
                <Container className="flex flex-col gap-4 p-4 rounded bg-white dark:bg-black">
                    <Heading
                        as="h1"
                        className="font-bold text-3xl text-black dark:text-white"
                    >
                        Congrats, {userName}!
                    </Heading>
                    <Text className="text-xl text-black dark:text-white">
                        {ownerName} has shared their {listName} list with you!
                        Go to your{' '}
                        <Link href={process.env.NEXT_PUBLIC_SITE_URL as string}>
                            wishlist home page
                        </Link>{' '}
                        to view it now.
                    </Text>
                </Container>
            </Head>
        </Tailwind>
    );
}
