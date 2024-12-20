import { useLists } from '@/hooks';
import { ListItem as ListItemType } from '@/types';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { BaseModal } from './BaseModal';

interface PurchaseItemProps {
    isOpen: boolean;
    close: () => void;
    item: ListItemType;
}

export function PurchaseItem({ isOpen, close, item }: PurchaseItemProps) {
    const [isBuying, setIsBuying] = useState(false);
    const { toggleItemBought } = useLists();

    const markAsBought = () => {
        setIsBuying(true);
        toggleItemBought.mutate(
            {
                itemId: item.id,
                purchase: !item.boughtBy,
            },
            {
                onSuccess: () => {
                    setIsBuying(false);
                    close();
                    toast.success(
                        `Item marked as ${!item.boughtBy ? 'purchased' : 'available'}`
                    );
                },
                onError: () => {
                    setIsBuying(false);
                    toast.error(
                        'Something went wrong buying the item. Refresh and try again.'
                    );
                },
            }
        );
    };

    // have to allow for undefined item incase list is empty
    if (item === undefined) {
        return null;
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={() => {
                close();
            }}
        >
            <div className="flex flex-col gap-5">
                <Typography type="h3">
                    {!!item.boughtBy ? 'Unpurchase Item?' : 'Purchase Item?'}
                </Typography>

                <Typography type="p">
                    {`Are you sure you want to mark "${item.name}" as ${
                        !!item.boughtBy ? 'available for purchase' : 'purchased'
                    }?`}
                </Typography>

                <div className="flex flex-row gap-3">
                    <Button
                        btnType="secondary"
                        onClick={close}
                        disabled={isBuying}
                    >
                        Cancel
                    </Button>

                    <Button
                        btnType="primary"
                        onClick={markAsBought}
                        disabled={isBuying}
                    >
                        {isBuying
                            ? 'Buying Item...'
                            : !!item.boughtBy
                              ? 'Unpurchase'
                              : 'Purchase'}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
}
