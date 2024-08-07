import {
    Button,
    ErrorView,
    FadeIn,
    Header,
    List,
    SignIn,
    Spacer,
    primaryBtnClass,
} from '@/components';
import { useLists, useUser } from '@/hooks';
import { Pages } from '@/types';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMemo } from 'react';

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
        'animate-pulse bg-gray300 dark:bg-gray700 rounded-xl h-16 w-full';

    return (
        <FadeIn className="flex flex-col gap-8 items-center w-full max-w-3xl py-10 md:py-20">
            <Header />

            {/* Sign In */}
            {!session?.user && <SignIn />}

            {/* Loading State */}
            {!fullyLoaded && !!session?.user && (
                <FadeIn className="flex flex-col gap-8 items-center w-full">
                    <p className="text-black dark:text-white">
                        Loading lists...
                    </p>
                    <div className={pulseStyle} />
                    <div className={pulseStyle} />
                    <div className={pulseStyle} />
                    <div className={pulseStyle} />
                    <div className={pulseStyle} />
                </FadeIn>
            )}

            {/* Fully Loaded */}
            {fullyLoaded && (
                <FadeIn className="flex flex-col gap-8 items-center w-full">
                    {/* My Lists */}
                    <div className="flex flex-col w-full gap-2">
                        <h2 className="font-bold text-xl text-black dark:text-white">
                            Your Lists:
                        </h2>
                        {userLists.length > 0 ? (
                            <div className="flex flex-col gap-8">
                                {lists!
                                    .filter((list) => list.userId === user!.id)
                                    .map((list, index) => (
                                        <List
                                            key={`${index}-${list.name}`}
                                            isOwner
                                            list={list}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <p className="text-sm italic text-black dark:text-white">
                                No lists yet! Click the button below to get
                                started!
                            </p>
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
                        <h2 className="font-bold text-xl text-black dark:text-white">
                            Shared Lists:
                        </h2>
                        {sharedLists.length > 0 ? (
                            <div className="flex flex-col gap-8">
                                {lists!
                                    .filter((list) => list.userId !== user!.id)
                                    .map((list, index) => (
                                        <List
                                            key={`${index}-${list.name}`}
                                            list={list}
                                            isOwner={false}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <p className="text-sm italic text-black dark:text-white">
                                No lists shared with you. Ask your friends to
                                share their lists with you!
                            </p>
                        )}
                    </div>
                </FadeIn>
            )}
        </FadeIn>
    );
}
