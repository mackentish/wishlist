import {
    AddFriends,
    Button,
    FadeIn,
    Friend,
    FriendRequest,
    Typography,
} from '@/components';
import React, { useState } from 'react';

export default function Friends() {
    const [isOpen, setIsOpen] = useState(false);

    // TODO: get these from BE
    const mockFriendRequests = [
        { name: 'John Doe', email: 'john.doe@mail.com' },
        { name: 'Jane Doe', email: 'jane.doe@mail.com' },
        { name: 'Katie Trzepacz Tish', email: 'trzepaczkatie@gmail.com' },
    ];

    // TODO: get these from BE
    const mockFriends = [
        { name: 'John Doe', email: 'john.doe@mail.com' },
        { name: 'Jane Doe', email: 'jane.doe@mail.com' },
        { name: 'Katie Trzepacz Tish', email: 'trzepaczkatie@gmail.com' },
    ];

    return (
        <FadeIn className="flex flex-col gap-8 w-full justify-center items-center">
            {/* Friend Requests */}
            <div className="flex flex-col w-full gap-4 p-5 rounded-xl bg-gray100 dark:bg-gray900">
                <Typography type="h5">Friend Requests:</Typography>

                {mockFriendRequests.map((request, index) => (
                    <FriendRequest
                        key={`friend-request-${index}`}
                        name={request.name}
                        email={request.email}
                        onAccept={() => alert('TODO: accept friend request')}
                        onDecline={() => alert('TODO: decline friend request')}
                    />
                ))}
            </div>

            <Button onClick={() => setIsOpen(true)}>Add Friends</Button>

            {/* Current Friends */}
            <div className="flex flex-col w-full gap-4 p-5 rounded-xl bg-gray100 dark:bg-gray900">
                <Typography type="h5">Your Friends:</Typography>

                {mockFriends.map((request, index) => (
                    <Friend
                        key={`friend-request-${index}`}
                        name={request.name}
                        email={request.email}
                        onRemove={() => alert('TODO: remove friend')}
                    />
                ))}
            </div>

            <AddFriends isOpen={isOpen} close={() => setIsOpen(false)} />
        </FadeIn>
    );
}
