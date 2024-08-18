import colorThemes from '@/styles/colorThemes';
import { Pages } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { Button } from './Button';
import { X } from './icons';

export function Menu({
    handleThemeChange,
    activeTheme,
}: {
    handleThemeChange: (theme: keyof typeof colorThemes) => void;
    activeTheme: keyof typeof colorThemes;
}) {
    const { data: session } = useSession();
    const router = useRouter();
    const currentPath = router.pathname;
    const [isOpen, setIsOpen] = useState(false);

    const pages = useMemo(
        () => [
            { route: Pages.Home, name: 'Home' },
            { route: Pages.Friends, name: 'Friends' },
            { route: Pages.ShareGroups, name: 'Share Groups' },
        ],
        []
    );

    // TODO: menu is always open on desktop? (and not absolute)
    return (
        <AnimatePresence>
            {isOpen ? (
                <motion.div
                    key="menu"
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute z-50 top-0 left-0 flex flex-col gap-7 h-[100vh] px-6 py-8 bg-gray100 dark:bg-gray900"
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
                            <p className="font-bold text-sm text-black dark:text-white">
                                {session!.user!.email}
                            </p>
                        </div>

                        <button
                            className="cursor-pointer"
                            onClick={() => setIsOpen(false)}
                        >
                            <X />
                        </button>
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
                        {pages.map(({ route, name }) => (
                            <Link
                                key={name}
                                href={route}
                                className="flex flex-row gap-4 p-4 text-black dark:text-white"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 1 }}
                                    className="h-full w-full"
                                >
                                    {name}
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    <ColorTheme
                        handleThemeChange={handleThemeChange}
                        activeTheme={activeTheme}
                    />

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

function ColorTheme({
    handleThemeChange,
    activeTheme,
}: {
    handleThemeChange: (theme: keyof typeof colorThemes) => void;
    activeTheme: keyof typeof colorThemes;
}) {
    // TODO: animated selected border
    const selectedBorder = 'border-2 border-black dark:border-white';

    return (
        <div className="flex flex-row w-full">
            {/* 
            According to the tailwind docs (https://tailwindcss.com/docs/content-configuration#class-detection-in-depth), 
            you can't break up the class name by using dynamic style. So something like `w-${size}` or `bg-[${colorThemes.orange.primary}]`
            wouldn't work. Therefore, I'm unable to supply the colors dynamically and instead have to paste them in. 
            */}
            <button
                onClick={() => handleThemeChange('orange')}
                className={`w-full h-8 bg-[#EB5E27] rounded-l-xl ${activeTheme === 'orange' && selectedBorder}`}
            />
            <button
                onClick={() => handleThemeChange('maroon')}
                className={`w-full h-8 bg-[#A8328F] ${activeTheme === 'maroon' && selectedBorder}`}
            />
            <button
                onClick={() => handleThemeChange('purple')}
                className={`w-full h-8 bg-[#7B32A8] ${activeTheme === 'purple' && selectedBorder}`}
            />
            <button
                onClick={() => handleThemeChange('turquoise')}
                className={`w-full h-8 bg-[#32A8A4] rounded-r-xl ${activeTheme === 'turquoise' && selectedBorder}`}
            />
        </div>
    );
}
