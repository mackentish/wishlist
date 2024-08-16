import { useTheme } from '@/hooks';
import colorThemes from '@/styles/colorThemes';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Menu } from '.';

export function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();

    const handleThemeChange = (theme: keyof typeof colorThemes) => {
        setTheme(theme);
        localStorage.setItem('theme', theme);
    };

    const selectedBorder = 'border-2 border-black dark:border-white';

    // color theme used for react-tostify
    let windowColorTheme = 'light';
    if (
        typeof window !== 'undefined' && // << do this check to avoid SSR error
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        windowColorTheme = 'dark';
    }

    return (
        <main
            data-theme={theme}
            className="min-h-screen min-w-screen bg-white dark:bg-black"
        >
            {session?.user && <Menu />}
            <div className="flex flex-col w-full h-full p-4">
                <div className="flex flex-row justify-center items-center w-full">
                    {children}
                </div>
                <ToastContainer
                    position="bottom-left"
                    theme={windowColorTheme}
                    progressClassName={
                        typeof localStorage === 'undefined'
                            ? ''
                            : `${localStorage.getItem('theme')}ToastProgress`
                    }
                    bodyClassName="toastBody"
                    style={{ borderRadius: '12px' }}
                />
            </div>
        </main>
    );
}
