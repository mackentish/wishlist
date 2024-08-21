import { useTheme } from '@/hooks';
import colorThemes from '@/styles/colorThemes';
import { Pages } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Friends, Home, Moon, Share, Sun, Typography, X } from '.';

export function Menu() {
    const { data: session } = useSession();
    const router = useRouter();
    const currentPath = router.pathname;
    const [isOpen, setIsOpen] = useState(false);
    const [staticSidebar, setStaticSidebar] = useState(
        window.innerWidth > 1100
    );

    const pages = useMemo(
        () => [
            { route: Pages.Home, name: 'Home', icon: <Home /> },
            { route: Pages.Friends, name: 'Friends', icon: <Friends /> },
            {
                route: Pages.ShareGroups,
                name: 'Share Groups',
                icon: (
                    <Share
                        tooltip={false}
                        classOverride="fill-black dark:fill-white"
                    />
                ),
            },
        ],
        []
    );

    useEffect(() => {
        // set listener for window resize
        window.addEventListener('resize', () => {
            setStaticSidebar(window.innerWidth > 1100);
        });

        // cleanup
        return () => {
            window.removeEventListener('resize', () => {
                setStaticSidebar(window.innerWidth > 1100);
            });
        };
    }, []);

    // TODO: menu is only collapsible on mobile (window.innerWidth < 1000), not desktop
    return (
        <AnimatePresence>
            {isOpen || staticSidebar ? (
                <motion.div
                    key="menu"
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={[
                        'flex flex-col gap-7 h-[100vh] px-6 py-8 bg-gray100 dark:bg-gray900',
                        staticSidebar
                            ? 'min-w-fit w-96'
                            : 'absolute z-50 top-0 left-0',
                    ].join(' ')}
                >
                    {/* User */}
                    <div className="flex flex-row w-full justify-between gap-4 items-center">
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                src={session!.user!.image!!}
                                alt="User Avatar"
                                width={32}
                                height={32}
                                style={{ borderRadius: '50%' }}
                            />
                            <Typography
                                type="p"
                                classOverride="font-bold text-sm"
                            >
                                {session!.user!.email}
                            </Typography>
                        </div>

                        {/* Only allow close button on mobile */}
                        {!staticSidebar && (
                            <button
                                className="cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                <X />
                            </button>
                        )}
                    </div>

                    {/* Pages */}
                    <div className="relative flex flex-col">
                        {/* Animated Selector */}
                        <motion.div
                            className="absolute z-[-1] w-full bg-gray300 dark:bg-gray700 rounded-xl"
                            style={{ height: `${100 / pages.length}%` }}
                            animate={{
                                y: `${pages.findIndex((p) => p.route === currentPath) * 100}%`,
                                transition: { duration: 0.3 },
                            }}
                        />

                        {/* Links */}
                        {pages.map(({ route, name, icon }) => (
                            <Link key={name} href={route}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 1 }}
                                    className="relative flex flex-row gap-4 p-4 text-black dark:text-white h-full w-full"
                                >
                                    {icon}
                                    {name}
                                    {name === 'Friends' && (
                                        <FriendRequestIndicator />
                                    )}
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    <ColorTheme />

                    {/* Sign Out */}
                    <Button btnType="danger" onClick={() => signOut()}>
                        Sign out
                    </Button>
                </motion.div>
            ) : (
                <motion.button
                    key="menu-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute z-50 top-4 left-4 flex flex-col gap-[6px] w-8 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="w-full h-1 rounded-full bg-primary"
                        />
                    ))}
                </motion.button>
            )}
        </AnimatePresence>
    );
}

function ColorTheme() {
    const { theme, setTheme, isDarkMode, setIsDarkMode } = useTheme();
    // NOTE: to keep track of the order
    const colors = Object.keys(colorThemes);

    /* 
        According to the tailwind docs (https://tailwindcss.com/docs/content-configuration#class-detection-in-depth), 
        you can't break up the class name by using dynamic style. So something like `w-${size}` or `bg-[${colorThemes.orange.primary}]`
        wouldn't work. Therefore, I'm unable to supply the colors dynamically and instead have to hardcode them in. 
    */
    return (
        <div className="flex flex-row w-full gap-7">
            <div className="relative flex flex-row w-full">
                <button
                    onClick={() => setTheme('orange')}
                    className="w-full h-8 bg-[#EB5E27] rounded-l-xl"
                />

                <button
                    onClick={() => setTheme('maroon')}
                    className="w-full h-8 bg-[#A8328F]"
                />

                <button
                    onClick={() => setTheme('purple')}
                    className="w-full h-8 bg-[#7B32A8]"
                />

                <button
                    onClick={() => setTheme('turquoise')}
                    className="w-full h-8 bg-[#32A8A4] rounded-r-xl"
                />

                <motion.div
                    className={[
                        'absolute h-full border-2 border-black dark:border-white',
                    ].join(' ')}
                    style={{ width: `${100 / colors.length}%` }}
                    animate={{
                        x: `${colors.findIndex((c) => c === theme) * 100}%`,
                        transition: { duration: 0.3 },

                        // NOTE: hardcoded border radius for far right
                        borderTopRightRadius:
                            theme === colors[colors.length - 1] ? 12 : 0,
                        borderBottomRightRadius:
                            theme === colors[colors.length - 1] ? 12 : 0,

                        // NOTE: hardcoded border radius for far left
                        borderTopLeftRadius: theme === colors[0] ? 12 : 0,
                        borderBottomLeftRadius: theme === colors[0] ? 12 : 0,
                    }}
                />
            </div>

            <div className="flex flex-row gap-2">
                <button onClick={() => setIsDarkMode(false)}>
                    <Sun isActive={!isDarkMode} />
                </button>

                <button onClick={() => setIsDarkMode(true)}>
                    <Moon isActive={isDarkMode} />
                </button>
            </div>
        </div>
    );
}

function FriendRequestIndicator() {
    // TODO: get these from BE
    const mockFriendRequests = [1, 2, 3];

    return (
        <div className="absolute right-4 flex items-center justify-center w-6 h-6 font-bold bg-primary text-white rounded-full">
            {mockFriendRequests.length}
        </div>
    );
}
