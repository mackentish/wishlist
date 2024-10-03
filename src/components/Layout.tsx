import { useTheme } from '@/hooks';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Menu } from '.';

export function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { theme, isDarkMode } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <main
            data-theme={theme}
            className="flex flex-row w-screen h-screen overflow-y-auto p-4 bg-white-100 dark:bg-black-900"
        >
            {session?.user && (
                <Menu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
            )}
            <div
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col w-full h-full"
            >
                <div className="flex flex-row justify-center items-center w-full">
                    <div className="flex flex-col items-center w-full max-w-3xl py-10 md:py-20">
                        <Header />
                        {children}
                    </div>
                </div>
                <ToastContainer
                    position="bottom-left"
                    pauseOnFocusLoss={false}
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
