import {
    Container,
    Head,
    Heading,
    Link,
    Tailwind,
    Text,
} from '@react-email/components';
import React from 'react';

interface ListInviteTemplateProps {
    ownerName: string;
    listName: string;
}

export function ListInviteTemplate({
    ownerName,
    listName,
}: ListInviteTemplateProps) {
    return (
        <Tailwind>
            <Head>
                <Container className="flex flex-col gap-4 p-4 rounded-xl bg-white-100 dark:bg-black-900">
                    <Heading
                        as="h1"
                        className="font-bold text-3xl text-black-900 dark:text-white-100"
                    >
                        Congrats!
                    </Heading>
                    <Text className="text-xl text-black-900 dark:text-white-100">
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
