import { useFriends } from '@/hooks';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CircleX, Typography } from '.';

interface FriendProps {
    friendId: number;
    name: string;
    email: string;
}

export function Friend({ friendId, name, email }: FriendProps) {
    const { removeFriend } = useFriends();
    const [isRemoving, setIsRemoving] = useState(false);

    const onRemove = () => {
        setIsRemoving(true);
        removeFriend.mutate(
            { friendId },
            {
                onSuccess: () => {
                    toast.success('Friend removed');
                },
                onError: () => {
                    toast.error('Error removing friend');
                },
                onSettled: () => {
                    setIsRemoving(false);
                },
            }
        );
    };

    return (
        <div className="flex flex-row w-full items-center justify-between p-4 bg-gray300 dark:bg-gray700 rounded-xl">
            {/* Personal Info */}
            <div className="flex flex-col gap-1">
                <Typography type="p" classOverride="font-bold">
                    {name}
                </Typography>
                <Typography type="p" classOverride="text-sm">
                    {email}
                </Typography>
            </div>

            {/* Remove */}
            {isRemoving ? (
                <Typography type="p" classOverride="font-bold">
                    Removing...
                </Typography>
            ) : (
                <button onClick={onRemove}>
                    <CircleX />
                </button>
            )}
        </div>
    );
}
