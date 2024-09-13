import {
    Button,
    FadeIn,
    Friends,
    Pencil,
    Trash,
    Typography,
} from '@/components';
import { ShareUser, User } from '@/types';
import React from 'react';

export default function ShareGroups() {
    return (
        <FadeIn className="flex flex-col gap-8 w-full justify-center items-center">
            <div className="flex flex-col w-full gap-4 p-5 rounded-xl bg-gray100 dark:bg-gray900">
                <Typography type="h5">Your Share Groups:</Typography>

                <ShareGroup
                    id="1"
                    name="Trzepacz Fam"
                    description="the whole family ... blah blah"
                    members={[
                        { name: 'John Doe', email: 'john.doe@gmail.com' },
                        { name: 'John Doe', email: 'john.doe@gmail.com' },
                        { name: 'John Doe', email: 'john.doe@gmail.com' },
                        { name: 'John Doe', email: 'john.doe@gmail.com' },
                        { name: 'John Doe', email: 'john.doe@gmail.com' },
                        { name: 'John Doe', email: 'john.doe@gmail.com' },
                    ]}
                />
            </div>

            <Button onClick={() => alert('TODO: implement')}>
                Create Group
            </Button>
        </FadeIn>
    );
}

// TODO: make ShareGroup type and use it
function ShareGroup({
    id,
    name,
    description,
    members,
}: {
    id: string;
    name: string;
    description: string;
    members: ShareUser[];
}) {
    return (
        <div className="flex flex-row w-full justify-between p-4 rounded-xl bg-gray300 dark:bg-gray700">
            {/* Group Info */}
            <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-4">
                    <Typography type="p" classOverride="font-bold">
                        {name}
                    </Typography>

                    <div className="flex flex-row gap-2">
                        <Typography type="p" classOverride="font-bold">
                            {members.length}
                        </Typography>
                        <Friends />
                    </div>
                </div>

                <Typography type="p">{description}</Typography>
            </div>

            {/* Controls */}
            <div className="flex flex-row gap-4 items-center">
                <button onClick={() => alert('TODO: implement')}>
                    <Pencil />
                </button>

                <button onClick={() => alert('TODO: implement')}>
                    <Trash />
                </button>
            </div>
        </div>
    );
}
