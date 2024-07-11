import { useTheme } from '@/hooks';
import colorThemes from '@/styles/colorThemes';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '.';

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
            className="flex flex-col min-h-screen min-w-screen p-4 bg-white dark:bg-black"
        >
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-2">
                <div className="flex flex-row">
                    {/* According to the tailwind docs (https://tailwindcss.com/docs/content-configuration#class-detection-in-depth), 
                    you can't break up the class name by using dynamic style. So something like `w-${size}` or `bg-[${colorThemes.orange.primary}]`
                    wouldn't work. Therefore, I'm unable to supply the colors dynamically and instead have to paste them in. */}
                    <button
                        onClick={() => handleThemeChange('orange')}
                        className={`w-8 h-8 bg-[#EB5E27] rounded-l-xl ${theme === 'orange' && selectedBorder}`}
                    />
                    <button
                        onClick={() => handleThemeChange('maroon')}
                        className={`w-8 h-8 bg-[#A8328F] ${theme === 'maroon' && selectedBorder}`}
                    />
                    <button
                        onClick={() => handleThemeChange('purple')}
                        className={`w-8 h-8 bg-[#7B32A8] ${theme === 'purple' && selectedBorder}`}
                    />
                    <button
                        onClick={() => handleThemeChange('turquoise')}
                        className={`w-8 h-8 bg-[#32A8A4] rounded-r-xl ${theme === 'turquoise' && selectedBorder}`}
                    />
                </div>
                {session?.user && (
                    <div className="flex flex-row flex-wrap justify-center gap-2 items-center md:flex-nowrap">
                        <Image
                            src={session.user.image!!}
                            alt="User Avatar"
                            width={32}
                            height={32}
                            style={{ borderRadius: '50%' }}
                        />
                        <p className="font-bold text-sm text-black dark:text-white">
                            {session.user.email}
                        </p>
                        <Button onClick={() => signOut()}>Sign out</Button>
                    </div>
                )}
            </div>
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
            />
        </main>
    );
}
