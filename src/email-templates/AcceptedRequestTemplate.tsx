import {
    Container,
    Head,
    Heading,
    Link,
    Tailwind,
    Text,
} from '@react-email/components';
import React from 'react';

interface AcceptedRequestTemplateProps {
    friendName: string;
}

export function AcceptedRequestTemplate({
    friendName,
}: AcceptedRequestTemplateProps) {
    return (
        <Tailwind>
            <Head>
                <Container className="flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-black">
                    <Heading
                        as="h1"
                        className="font-bold text-3xl text-black dark:text-white"
                    >
                        New Friend Alert!
                    </Heading>
                    <Text className="text-xl text-black dark:text-white">
                        {friendName} has accepted your friend request! Go to{' '}
                        <Link href={process.env.NEXT_PUBLIC_SITE_URL as string}>
                            wishlist
                        </Link>{' '}
                        to share your lists with your new friend.
                    </Text>
                </Container>
            </Head>
        </Tailwind>
    );
}
