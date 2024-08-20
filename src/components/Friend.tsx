import React from 'react';
import { CircleX, Typography } from '.';

interface FriendProps {
    name: string;
    email: string;
    onRemove: () => void;
}

export function Friend({ name, email, onRemove }: FriendProps) {
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
            <button onClick={onRemove}>
                <CircleX />
            </button>
        </div>
    );
}
