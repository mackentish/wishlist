import { useLists } from '@/hooks';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { BaseModal } from './BaseModal';

interface RemoveItemsProps {
    isOpen: boolean;
    close: () => void;
    listId: number;
}
export function RemoveItems({ isOpen, close, listId }: RemoveItemsProps) {
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onRequestClose={() => {
                    close();
                }}
            >
                <div className="flex flex-col gap-5">
                    <Typography type="h3">Remove Purchased Items?</Typography>

                    <Typography type="p">
                        Removing purchased items from your list prematurely
                        could spoil the surprise! Are you sure you want to
                        remove them?
                    </Typography>

                    <Typography type="p" classOverride="font-bold">
                        This cannot be undone.
                    </Typography>

                    <div className="flex flex-row gap-3">
                        <Button btnType="secondary" onClick={close}>
                            Cancel
                        </Button>

                        <Button
                            btnType="primary"
                            onClick={() => setEmailModalOpen(true)}
                        >
                            Remove Items
                        </Button>
                    </div>
                </div>
            </BaseModal>

            <SendEmail
                isOpen={isEmailModalOpen}
                close={() => setEmailModalOpen(false)}
                listId={listId}
                onDone={close}
            />
        </>
    );
}

interface SendEmailProps extends RemoveItemsProps {
    onDone: () => void;
}
function SendEmail({ isOpen, close, onDone, listId }: SendEmailProps) {
    const { deletePurchasedItems } = useLists();

    const [isUpdating, setIsUpdating] = useState(false);

    const onSelect = (sendEmail: boolean) => {
        setIsUpdating(true);
        deletePurchasedItems.mutate(
            { listId, sendEmail },
            {
                onSuccess: () => {
                    setIsUpdating(false);
                    close();
                    onDone();
                    toast.success('Items removed!');
                },
                onError: () => {
                    setIsUpdating(false);
                    toast.error('Something went wrong removing your items!');
                },
            }
        );
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={() => {
                close();
            }}
        >
            <div className="flex flex-col gap-5">
                <Typography type="h3">Send Email?</Typography>

                <Typography type="p">
                    Would you like to receive an email with a list of purchased
                    items and who bought them? It could be helpful for writing
                    thank you cards 👀
                </Typography>

                <div className="flex flex-row gap-3">
                    <Button
                        btnType="secondary"
                        onClick={() => onSelect(false)}
                        disabled={isUpdating}
                    >
                        No thanks
                    </Button>

                    <Button
                        btnType="primary"
                        onClick={() => onSelect(true)}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Removing items...' : 'Yes, Send Email'}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
}
