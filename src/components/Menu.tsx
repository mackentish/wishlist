import { useTheme } from '@/hooks';
import colorThemes from '@/styles/colorThemes';
import { Pages } from '@/types';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button } from './Button';
import { X } from './icons';

// TODO: Implement onClose function with three dashes
export function Menu() {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const currentPath = router.pathname;
    const [isOpen, setIsOpen] = useState(false);

    const handleThemeChange = (theme: keyof typeof colorThemes) => {
        setTheme(theme);
        localStorage.setItem('theme', theme);
    };

    const styles = {
        selectedBorder: 'border-2 border-black dark:border-white',
        page: {
            base: 'flex flex-row gap-4 p-4 rounded-xl text-black dark:text-white',
            selected: 'bg-gray300 dark:bg-gray700',
        },
    };

    // TODO: use motion to animate the menu (open/close, selecting page, selecting color theme, etc.)
    // TODO: color picker not working
    return (
        <div
            className={`absolute z-50 ${isOpen ? 'top-0 left-0' : 'top-4 left-4'}`}
        >
            {isOpen ? (
                <div className="flex flex-col gap-7 h-[100vh] px-6 py-8 bg-gray100 dark:bg-gray900">
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
                    <div className="flex flex-col gap-2">
                        <Link
                            href={Pages.Home}
                            className={[
                                styles.page.base,
                                currentPath === Pages.Home
                                    ? styles.page.selected
                                    : '',
                            ].join(' ')}
                        >
                            Home
                        </Link>
                        <Link
                            href={Pages.Friends}
                            className={[
                                styles.page.base,
                                currentPath === Pages.Friends
                                    ? styles.page.selected
                                    : '',
                            ].join(' ')}
                        >
                            Friends
                        </Link>
                        <Link
                            href={Pages.ShareGroups}
                            className={[
                                styles.page.base,
                                currentPath === Pages.ShareGroups
                                    ? styles.page.selected
                                    : '',
                            ].join(' ')}
                        >
                            Share Groups
                        </Link>
                    </div>

                    {/* Color Theme */}
                    <div className="flex flex-row w-full">
                        {/* According to the tailwind docs (https://tailwindcss.com/docs/content-configuration#class-detection-in-depth), 
                    you can't break up the class name by using dynamic style. So something like `w-${size}` or `bg-[${colorThemes.orange.primary}]`
                    wouldn't work. Therefore, I'm unable to supply the colors dynamically and instead have to paste them in. */}
                        <button
                            onClick={() => handleThemeChange('orange')}
                            className={`w-full h-8 bg-[#EB5E27] rounded-l-xl ${theme === 'orange' && styles.selectedBorder}`}
                        />
                        <button
                            onClick={() => handleThemeChange('maroon')}
                            className={`w-full h-8 bg-[#A8328F] ${theme === 'maroon' && styles.selectedBorder}`}
                        />
                        <button
                            onClick={() => handleThemeChange('purple')}
                            className={`w-full h-8 bg-[#7B32A8] ${theme === 'purple' && styles.selectedBorder}`}
                        />
                        <button
                            onClick={() => handleThemeChange('turquoise')}
                            className={`w-full h-8 bg-[#32A8A4] rounded-r-xl ${theme === 'turquoise' && styles.selectedBorder}`}
                        />
                    </div>

                    {/* Sign Out */}
                    <Button btnType="danger" onClick={() => signOut()}>
                        Sign out
                    </Button>
                </div>
            ) : (
                <button
                    className="flex flex-col gap-[6px] w-8 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="w-full h-1 rounded-full bg-primary"
                        />
                    ))}
                </button>
            )}
        </div>
    );
}
