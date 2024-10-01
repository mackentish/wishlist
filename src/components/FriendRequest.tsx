import { useFriends } from '@/hooks';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CircleCheck, CircleX, Typography } from '.';

interface FriendRequestProps {
    id: number;
    name: string;
    email: string;
}

export function FriendRequest({ id, name, email }: FriendRequestProps) {
    const { updateFriendRequest } = useFriends();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleFriendRequest = async (accept: boolean) => {
        setIsUpdating(true);
        updateFriendRequest.mutate(
            { requestId: id, accept },
            {
                onSuccess: () => {
                    toast.success(
                        `Friend request ${accept ? 'accepted' : 'declined'}`
                    );
                },
                onError: () => {
                    toast.error(
                        `Failed to ${accept ? 'accept' : 'decline'} friend request`
                    );
                },
                onSettled: () => {
                    setIsUpdating(false);
                },
            }
        );
    };

    return (
        <div
            className={[
                'flex flex-row w-full items-center justify-between p-4 bg-gray-300 dark:bg-gray-700 rounded-xl',
                isUpdating ? 'animate-pulse' : '',
            ].join(' ')}
        >
            {/* Personal Info */}
            <div className="flex flex-row items-center gap-3">
                <Typography type="p" classOverride="font-bold">
                    {name}
                </Typography>
                <Typography type="p" classOverride="text-sm">
                    {email}
                </Typography>
            </div>

            {/* Accept/Decline */}
            {isUpdating ? (
                <Typography type="p" classOverride="font-bold">
                    Updating...
                </Typography>
            ) : (
                <div className="flex flex-row gap-4">
                    <button onClick={() => handleFriendRequest(false)}>
                        <CircleX classOverride="fill-error-500 hover:fill-error-600 transition-colors duration-200" />
                    </button>

                    <button onClick={() => handleFriendRequest(true)}>
                        <CircleCheck />
                    </button>
                </div>
            )}
        </div>
    );
}
