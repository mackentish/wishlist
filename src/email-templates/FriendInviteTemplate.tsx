import {
    Container,
    Head,
    Heading,
    Link,
    Tailwind,
    Text,
} from '@react-email/components';
import React from 'react';

interface FriendInviteTemplateProps {
    senderName: string;
}

export function FriendInviteTemplate({
    senderName,
}: FriendInviteTemplateProps) {
    return (
        <Tailwind>
            <Head>
                <Container className="flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-black">
                    <Heading
                        as="h1"
                        className="font-bold text-3xl text-black dark:text-white"
                    >
                        Hello!
                    </Heading>
                    <Text className="text-xl text-black dark:text-white">
                        {senderName} has invited you to join wishlist! Go to{' '}
                        <Link href={process.env.NEXT_PUBLIC_SITE_URL as string}>
                            wishlist
                        </Link>{' '}
                        to sign up so you can create and share lists with your
                        friends.
                    </Text>
                </Container>
            </Head>
        </Tailwind>
    );
}
