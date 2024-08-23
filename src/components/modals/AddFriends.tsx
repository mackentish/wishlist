import { useFriends } from '@/hooks';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Input, Typography } from '..';
import { BaseModal } from './BaseModal';

interface AddFriendsProps {
    isOpen: boolean;
    close: () => void;
}

export function AddFriends({ isOpen, close }: AddFriendsProps) {
    const { sendFriendRequest } = useFriends();
    const [addEmail, setAddEmail] = useState('');
    const [isSending, setIsSending] = useState(false);

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={() => {
                close();
                setAddEmail('');
            }}
        >
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
                        disabled={isSending}
                    />

                    <Button
                        onClick={() => {
                            // TODO: validate email
                            setIsSending(true);
                            sendFriendRequest.mutate(
                                { email: addEmail },
                                {
                                    onSuccess: () => {
                                        setIsSending(false);
                                        setAddEmail('');
                                        toast.success('Friend request sent!');
                                    },
                                    onError: () => {
                                        setIsSending(false);
                                        toast.error(
                                            'Failed to send friend request, try again later.'
                                        );
                                    },
                                }
                            );
                        }}
                        disabled={!addEmail || isSending}
                    >
                        {isSending ? 'Sending...' : 'Send Request'}
                    </Button>
                </div>

                <Button btnType="secondary" onClick={close}>
                    Done
                </Button>
            </div>
        </BaseModal>
    );
}
