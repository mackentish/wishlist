import { useTheme } from '@/hooks';
import { useSession } from 'next-auth/react';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Menu } from '.';

export function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { theme, isDarkMode } = useTheme();

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
                    theme={isDarkMode ? 'dark' : 'light'}
                    progressClassName={
                        typeof localStorage === 'undefined'
                            ? ''
                            : `${localStorage.getItem('wishlist_theme')}ToastProgress`
                    }
                    bodyClassName="toastBody"
                    style={{ borderRadius: '12px' }}
                />
            </div>
        </main>
    );
}
