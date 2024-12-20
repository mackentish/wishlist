import { useLists } from '@/hooks';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { BaseModal } from './BaseModal';

interface RemoveSharedListProps {
    isOpen: boolean;
    close: () => void;
    listId: number;
}

export function RemoveSharedList({
    isOpen,
    close,
    listId,
}: RemoveSharedListProps) {
    const [isRemoving, setIsRemoving] = useState(false); // Determines if the user is removing the shared list from their view
    const { deleteSharedList } = useLists();

    const removeSharedList = () => {
        setIsRemoving(true);
        deleteSharedList.mutate(listId, {
            onSuccess: () => {
                setIsRemoving(false);
                close();
                toast.success('Shared list removed');
            },
            onError: () => {
                toast.error('Something went wrong removing your shared list');
                setIsRemoving(false);
            },
        });
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={() => {
                close();
            }}
        >
            <div className="flex flex-col gap-5">
                <Typography type="h3">Remove Shared List?</Typography>

                <Typography type="p">
                    {
                        "Once you remove this shared list, you won't have access to it unless the owner re-shares it with you."
                    }
                </Typography>

                <div className="flex flex-row gap-3">
                    <Button
                        btnType="secondary"
                        onClick={close}
                        disabled={isRemoving}
                    >
                        Cancel
                    </Button>

                    <Button
                        btnType="primary"
                        onClick={removeSharedList}
                        disabled={isRemoving}
                    >
                        {isRemoving ? 'Removing...' : 'Remove List'}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
}
