import {
    AddFriends,
    Button,
    FadeIn,
    Friend,
    FriendRequest,
    Typography,
} from '@/components';
import { useFriends } from '@/hooks';
import React, { useState } from 'react';

export default function Friends() {
    const {
        fetchFriends: {
            data: friends,
            isLoading: friendsLoading,
            isError: friendsError,
        },
        fetchFriendRequests: {
            data: friendRequests,
            isLoading: friendRequestsLoading,
            isError: friendRequestsError,
        },
    } = useFriends();
    const [isOpen, setIsOpen] = useState(false);

    // TODO: loading and error states - the below are placeholders
    if (friendsLoading || friendRequestsLoading) {
        return <Typography type="h3">Loading...</Typography>;
    }
    if (friendsError || friendRequestsError) {
        return <Typography type="h3">Error loading friends</Typography>;
    }

    return (
        <FadeIn className="flex flex-col gap-8 w-full justify-center items-center">
            {/* Friend Requests */}
            {!!friendRequests && friendRequests.length > 0 && (
                <div className="flex flex-col w-full gap-4 p-5 rounded-xl bg-gray100 dark:bg-gray900">
                    <Typography type="h5">Friend Requests:</Typography>

                    {friendRequests.map((request, index) => (
                        <FriendRequest
                            key={`friend-request-${index}`}
                            id={request.id}
                            name={request.name}
                            email={request.email}
                        />
                    ))}
                </div>
            )}

            <Button onClick={() => setIsOpen(true)}>Add Friends</Button>

            {/* Current Friends */}
            {!!friends && friends.length > 0 ? (
                <div className="flex flex-col w-full gap-4 p-5 rounded-xl bg-gray100 dark:bg-gray900">
                    <Typography type="h5">Your Friends:</Typography>

                    {friends.map((request, index) => (
                        <Friend
                            key={`friend-request-${index}`}
                            name={request.name}
                            email={request.email}
                            onRemove={() => alert('TODO: remove friend')}
                        />
                    ))}
                </div>
            ) : (
                <Typography type="p" classOverride="italic">
                    You have no friends yet! Add some now!
                </Typography>
            )}

            <AddFriends isOpen={isOpen} close={() => setIsOpen(false)} />
        </FadeIn>
    );
}
