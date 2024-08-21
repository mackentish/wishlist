import React, { useState } from 'react';
import { Button, Input, Typography } from '..';
import { BaseModal } from './BaseModal';

interface AddFriendsProps {
    isOpen: boolean;
    close: () => void;
}

export function AddFriends({ isOpen, close }: AddFriendsProps) {
    const [addEmail, setAddEmail] = useState('');

    return (
        <BaseModal isOpen={isOpen} onRequestClose={close}>
            <div className="flex flex-col gap-10 w-full items-center items-center min-w-72">
                <div className="flex flex-col gap-2 items-center w-full">
                    <Typography type="h3">Add Friends</Typography>

                    <Typography type="p">
                        Send friend requests below by email!
                    </Typography>
                </div>

                <div className="flex flex-col gap-2 items-center w-full">
                    <Input
                        type="text"
                        placeholder="Enter email..."
                        value={addEmail}
                        onChange={(e) => setAddEmail(e.target.value)}
                    />

                    <Button
                        onClick={() =>
                            alert(`TODO: send friend request: ${addEmail}`)
                        }
                        disabled={!addEmail}
                    >
                        Send Request
                    </Button>
                </div>

                <Button btnType="secondary" onClick={close}>
                    Done
                </Button>
            </div>
        </BaseModal>
    );
}
