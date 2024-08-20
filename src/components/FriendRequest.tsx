import React from 'react';
import { CircleCheck, CircleX, Typography } from '.';

interface FriendRequestProps {
    name: string;
    email: string;
    onAccept: () => void;
    onDecline: () => void;
}

export function FriendRequest({
    name,
    email,
    onAccept,
    onDecline,
}: FriendRequestProps) {
    return (
        <div className="flex flex-row w-full items-center justify-between p-4 bg-gray300 dark:bg-gray700 rounded-xl">
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
            <div className="flex flex-row gap-4">
                <button onClick={onDecline}>
                    <CircleX classOverride="fill-error hover:fill-errorHover transition-colors duration-200" />
                </button>

                <button onClick={onAccept}>
                    <CircleCheck />
                </button>
            </div>
        </div>
    );
}
