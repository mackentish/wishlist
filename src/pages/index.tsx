import { ErrorView, List, SignIn, Spacer, primaryBtnClass } from '@/components';
import { useLists, useUser } from '@/hooks';
import { Pages } from '@/types';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMemo } from 'react';

export default function Home() {
    const { data: session } = useSession();
    const { isLoading: userLoading, error: userError, data: user } = useUser();
    const {
        fetchLists: { isLoading: listsLoading, error: listsError, data: lists },
    } = useLists();

    const userLists = useMemo(() => {
        if (!lists) return [];
        return lists.filter((list) => list.userId === user?.id);
    }, [lists, user?.id]);

    const sharedLists = useMemo(() => {
        if (!lists) return [];
        return lists.filter((list) => list.userId !== user?.id);
    }, [lists, user?.id]);

    if (!session?.user) {
        return <SignIn />;
    }

    if (userLoading || listsLoading) {
        return (
            <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
                <h1 className="font-mono font-bold text-3xl text-black dark:text-white">
                    wishlist
                </h1>
                <p className="font-mono text-xl text-black dark:text-white">
                    Loading...
                </p>
            </div>
        );
    }

    if (userError || !user || listsError || lists === undefined) {
        return <ErrorView />;
    }

    return (
        <div className="flex flex-col gap-8 items-center w-full max-w-3xl py-10 md:py-20">
            <h1 className="font-bold text-3xl text-black dark:text-white">
                wishlist
            </h1>

            {/* My Lists */}
            <div className="flex flex-col w-full gap-2">
                <h2 className="font-mono font-bold text-xl text-black dark:text-white">
                    Your Lists:
                </h2>
                {userLists.length > 0 ? (
                    lists
                        .filter((list) => list.userId === user.id)
                        .map((list, index) => (
                            <List
                                key={`${index}-${list.name}`}
                                isOwner
                                list={list}
                            />
                        ))
                ) : (
                    <p className="font-mono text-sm italic text-darkGrey dark:text-lightGrey">
                        No lists yet! Click the button below to get started!
                    </p>
                )}
                <Spacer />
                <Link href={Pages.CreateLists} className={primaryBtnClass}>
                    Create a List
                </Link>
            </div>

            {/* Shared Lists */}
            <div className="flex flex-col w-full gap-2">
                <h2 className="font-mono font-bold text-xl text-black dark:text-white">
                    Shared Lists:
                </h2>
                {sharedLists.length > 0 ? (
                    lists
                        .filter((list) => list.userId !== user.id)
                        .map((list, index) => (
                            <List
                                key={`${index}-${list.name}`}
                                list={list}
                                isOwner={false}
                            />
                        ))
                ) : (
                    <p className="font-mono text-sm italic text-darkGrey dark:text-lightGrey">
                        No lists shared with you. Ask your friends to share
                        their lists with you!
                    </p>
                )}
            </div>
        </div>
    );
}
