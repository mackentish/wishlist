import { useTheme } from '@/hooks';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Menu } from '.';

export function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { theme, isDarkMode } = useTheme();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [staticSidebar, setStaticSidebar] = useState(false); // set to false because we can't access window object in SSR

    useEffect(() => {
        // Check if window is available and set initial sidebar state
        if (typeof window !== 'undefined') {
            setStaticSidebar(window.innerWidth > 1100);
        }

        // Set listener for window resize
        const handleResize = () => {
            setStaticSidebar(window.innerWidth > 1100);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <main
            data-theme={theme}
            className="flex flex-row bg-white-100 dark:bg-black-900"
        >
            {session?.user && (
                <Menu
                    isOpen={isMenuOpen}
                    setIsOpen={setIsMenuOpen}
                    staticSidebar={staticSidebar}
                />
            )}
            <div
                onClick={() => setIsMenuOpen(false)}
                className={`flex flex-col p-4 w-screen min-h-screen ${staticSidebar ? 'overflow-y-auto' : ''}`}
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
