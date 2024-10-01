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

    // Error state
    if (friendsError || friendRequestsError) {
        return (
            <Typography
                type="h4"
                classOverride="text-error-500 dark:text-error-500"
            >
                Error loading friends. Try again later.
            </Typography>
        );
    }

    return (
        <FadeIn className="flex flex-col gap-8 w-full justify-center items-center">
            {/* Friend Requests */}
            <div className="flex flex-col w-full gap-4 p-5 rounded-xl bg-gray-100 dark:bg-gray-900">
                <Typography type="h5">Friend Requests:</Typography>

                {/* Loading */}
                {!!friendRequestsLoading && (
                    <div className="flex h-14 w-full rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse" />
                )}

                {/* Loaded */}
                {!friendRequestsLoading &&
                    !!friendRequests &&
                    friendRequests.length > 0 && (
                        <>
                            {friendRequests.map((request, index) => (
                                <FriendRequest
                                    key={`friend-request-${index}`}
                                    id={request.id}
                                    name={request.name}
                                    email={request.email}
                                />
                            ))}
                        </>
                    )}

                {/* No Friend Requests */}
                {!friendRequestsLoading &&
                    !!friendRequests &&
                    friendRequests.length === 0 && (
                        <Typography type="p" classOverride="italic self-center">
                            0 new friend requests
                        </Typography>
                    )}
            </div>

            {/* Current Friends */}
            <div className="flex flex-col w-full gap-4 p-5 rounded-xl bg-gray-100 dark:bg-gray-900">
                <Typography type="h5">Your Friends:</Typography>

                {/* Loading */}
                {!!friendsLoading && (
                    <div className="flex h-20 w-full rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse" />
                )}

                {/* Loaded */}
                {!friendsLoading && !!friends && friends.length > 0 && (
                    <>
                        {friends.map((friend, index) => (
                            <Friend
                                key={`friend-request-${index}`}
                                friendId={friend.id}
                                name={friend.name}
                                email={friend.email}
                            />
                        ))}
                    </>
                )}

                {/* No Friends */}
                {!friendsLoading && !!friends && friends.length === 0 && (
                    <Typography type="p" classOverride="italic self-center">
                        {"You haven't added any friends yet. Add some below!"}
                    </Typography>
                )}
            </div>

            <Button onClick={() => setIsOpen(true)}>Add Friends</Button>

            <AddFriends isOpen={isOpen} close={() => setIsOpen(false)} />
        </FadeIn>
    );
}
