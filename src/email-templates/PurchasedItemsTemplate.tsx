import {
    Container,
    Head,
    Heading,
    Tailwind,
    Text,
} from '@react-email/components';
import React from 'react';

interface PurchasedItemsTemplateProps {
    items: string[];
}

export function PurchasedItemsTemplate({ items }: PurchasedItemsTemplateProps) {
    return (
        <Tailwind>
            <Head>
                <Container className="flex flex-col gap-4 p-4 rounded-xl bg-white-100 dark:bg-black-900">
                    <Heading
                        as="h1"
                        className="font-bold text-3xl text-black-900 dark:text-white-100"
                    >
                        Congratulations!
                    </Heading>

                    <Heading
                        as="h3"
                        className="text-xl text-black-900 dark:text-white-100"
                    >
                        Below are the items purchased for you by your friends:
                    </Heading>

                    <Container className="flex flex-col gap-2">
                        {items.map((item, index) => (
                            <Text
                                key={`${index}-${item}`}
                                className="text-black-900 dark:text-white-100"
                            >
                                {item}
                            </Text>
                        ))}
                    </Container>
                </Container>
            </Head>
        </Tailwind>
    );
}
