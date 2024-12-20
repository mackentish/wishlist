import {
    DeleteList,
    ErrorView,
    FadeIn,
    ItemForm,
    List,
    RemoveItems,
    RemoveSharedList,
    ShareList,
    SignIn,
    Spacer,
    Typography,
    primaryBtnClass,
} from '@/components';
import { useLists, useUser } from '@/hooks';
import { Pages, ShareUser } from '@/types';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface DefaultListModalProps {
    isOpen: boolean;
    listId: number;
}
interface ShareModalProps extends DefaultListModalProps {
    sharedUsers: ShareUser[];
}
interface DeleteListModalProps extends DefaultListModalProps {
    boughtItems: number;
}

export default function Home() {
    const { data: session } = useSession();
    const {
        isLoading: userLoading,
        error: userError,
        data: user,
    } = useUser(!!session?.user);
    const {
        fetchLists: { isLoading: listsLoading, error: listsError, data: lists },
    } = useLists(!!user);

    const [shareModal, setShareModal] = useState<ShareModalProps>({
        isOpen: false,
        listId: 0,
        sharedUsers: [],
    });
    const [addItemModal, setAddItemModal] = useState<DefaultListModalProps>({
        isOpen: false,
        listId: 0,
    });
    const [deleteListModal, setDeleteListModal] =
        useState<DeleteListModalProps>({
            isOpen: false,
            listId: 0,
            boughtItems: 0,
        });
    const [removePurchasedModal, setRemovePurchasedModal] =
        useState<DefaultListModalProps>({
            isOpen: false,
            listId: 0,
        });
    const [removeSharedListModal, setRemoveSharedListModal] =
        useState<DefaultListModalProps>({
            isOpen: false,
            listId: 0,
        });

    const userLists = useMemo(() => {
        if (!lists) return [];
        return lists.filter((list) => list.userId === user?.id);
    }, [lists, user?.id]);

    const sharedLists = useMemo(() => {
        if (!lists) return [];
        return lists.filter((list) => list.userId !== user?.id);
    }, [lists, user?.id]);

    const fullyLoaded = useMemo(() => {
        return !!session?.user && !userLoading && !listsLoading;
    }, [userLoading, listsLoading, session?.user]);

    if (
        userError ||
        listsError ||
        (!!session?.user && !userLoading && !user) ||
        (!!user && !listsLoading && !lists)
    ) {
        return <ErrorView />;
    }

    const pulseStyle =
        'animate-pulse bg-gray-300 dark:bg-gray-700 rounded-xl h-16 w-full';

    return (
        <FadeIn className="flex flex-col gap-8 items-center w-full">
            {/* Sign In */}
            {!session?.user && <SignIn />}

            {/* Loading State */}
            {!fullyLoaded && !!session?.user && (
                <FadeIn className="flex flex-col gap-8 items-center w-full">
                    <Typography type="p">Loading lists...</Typography>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className={pulseStyle} />
                    ))}
                </FadeIn>
            )}

            {/* Fully Loaded */}
            {fullyLoaded && (
                <FadeIn className="flex flex-col gap-12 items-center w-full">
                    {/* My Lists */}
                    <div className="flex flex-col w-full gap-2">
                        <Typography type="h3">Your Lists:</Typography>
                        {userLists.length > 0 ? (
                            <div className="flex flex-col gap-8">
                                {lists!
                                    .filter((list) => list.userId === user!.id)
                                    .map((list, index) => (
                                        <List
                                            key={`${index}-${list.name}`}
                                            isOwner
                                            list={list}
                                            shareList={() => {
                                                setShareModal({
                                                    isOpen: true,
                                                    listId: list.id,
                                                    sharedUsers:
                                                        list.sharedUsers,
                                                });
                                            }}
                                            addItem={() => {
                                                setAddItemModal({
                                                    isOpen: true,
                                                    listId: list.id,
                                                });
                                            }}
                                            deleteList={() => {
                                                setDeleteListModal({
                                                    isOpen: true,
                                                    listId: list.id,
                                                    boughtItems:
                                                        list.items.filter(
                                                            (i) => i.boughtBy
                                                        ).length,
                                                });
                                            }}
                                            removePurchased={() => {
                                                setRemovePurchasedModal({
                                                    isOpen: true,
                                                    listId: list.id,
                                                });
                                            }}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <Typography type="p" classOverride="text-sm italic">
                                No lists yet! Click the button below to get
                                started!
                            </Typography>
                        )}
                        <Spacer />
                        <Link
                            href={Pages.CreateLists}
                            className={primaryBtnClass}
                        >
                            Create a List
                        </Link>
                    </div>

                    {/* Shared Lists */}
                    <div className="flex flex-col w-full gap-2">
                        <Typography type="h3">Shared Lists:</Typography>
                        {sharedLists.length > 0 ? (
                            <div className="flex flex-col gap-8">
                                {lists!
                                    .filter((list) => list.userId !== user!.id)
                                    .map((list, index) => (
                                        <List
                                            key={`${index}-${list.name}`}
                                            list={list}
                                            isOwner={false}
                                            removeList={() => {
                                                console.log('test');
                                                setRemoveSharedListModal({
                                                    isOpen: true,
                                                    listId: list.id,
                                                });
                                            }}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <Typography type="p" classOverride="text-sm italic">
                                No lists shared with you. Ask your friends to
                                share their lists with you!
                            </Typography>
                        )}
                    </div>
                </FadeIn>
            )}

            <ShareList
                isOpen={shareModal.isOpen}
                close={() =>
                    setShareModal((prevState) => ({
                        ...prevState,
                        isOpen: false,
                    }))
                }
                listId={shareModal.listId}
                sharedUsers={shareModal.sharedUsers}
            />

            <ItemForm
                isOpen={addItemModal.isOpen}
                close={() =>
                    setAddItemModal({
                        isOpen: false,
                        listId: 0,
                    })
                }
                listId={addItemModal.listId}
            />

            <DeleteList
                isOpen={deleteListModal.isOpen}
                close={() =>
                    setDeleteListModal({
                        isOpen: false,
                        listId: 0,
                        boughtItems: 0,
                    })
                }
                listId={deleteListModal.listId}
                boughtItems={deleteListModal.boughtItems}
            />

            <RemoveItems
                isOpen={removePurchasedModal.isOpen}
                close={() =>
                    setRemovePurchasedModal({
                        isOpen: false,
                        listId: 0,
                    })
                }
                listId={removePurchasedModal.listId}
            />

            <RemoveSharedList
                isOpen={removeSharedListModal.isOpen}
                close={() =>
                    setRemoveSharedListModal({
                        isOpen: false,
                        listId: 0,
                    })
                }
                listId={removeSharedListModal.listId}
            />
        </FadeIn>
    );
}
