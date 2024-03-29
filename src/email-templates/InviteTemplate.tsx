import {
    Container,
    Head,
    Heading,
    Link,
    Tailwind,
    Text,
} from '@react-email/components';
import React from 'react';

interface InviteTemplateProps {
    ownerName: string;
    listName: string;
}

export function InviteTemplate({ ownerName, listName }: InviteTemplateProps) {
    return (
        <Tailwind>
            <Head>
                <Container className="flex flex-col gap-4 p-4 rounded bg-white dark:bg-black">
                    <Heading
                        as="h1"
                        className="font-bold text-3xl text-black dark:text-white"
                    >
                        Congrats!
                    </Heading>
                    <Text className="text-xl text-black dark:text-white">
                        {ownerName} has shared their {listName} list with you!
                        Go to{' '}
                        <Link href={process.env.NEXT_PUBLIC_SITE_URL as string}>
                            wishlist
                        </Link>{' '}
                        to sign up and view it now.
                    </Text>
                </Container>
            </Head>
        </Tailwind>
    );
}
