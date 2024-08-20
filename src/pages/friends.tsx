import { Button, FadeIn, Typography } from '@/components';
import React from 'react';

export default function Friends() {
    return (
        <FadeIn className="flex flex-col gap-8 w-full justify-center items-center">
            <div className="flex flex-col gap-4 p-5 rounded-xl bg-grey100 dark:bg-grey900">
                <Typography type="h5">Friend Requests</Typography>
            </div>
            <Button onClick={() => alert('TODO: open modal')}>
                Add Friends
            </Button>
        </FadeIn>
    );
}
