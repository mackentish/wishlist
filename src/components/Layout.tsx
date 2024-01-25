import colorThemes from '@/styles/colorThemes';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '.';

export function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [theme, setTheme] = useState<keyof typeof colorThemes>('orange');
    const themeSize = 6;

    return (
        <main
            data-theme={theme}
            className="flex flex-col min-h-screen min-w-screen p-4 bg-white dark:bg-black"
        >
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-2">
                <div className="flex flex-row border border-black dark:border-white rounded">
                    <button
                        onClick={() => setTheme('orange')}
                        className={`w-${themeSize} h-${themeSize} bg-[${colorThemes.orange.primary}]`}
                    />
                    <button
                        onClick={() => setTheme('maroon')}
                        className={`w-${themeSize} h-${themeSize} bg-[${colorThemes.maroon.primary}]`}
                    />
                    <button
                        onClick={() => setTheme('purple')}
                        className={`w-${themeSize} h-${themeSize} bg-[${colorThemes.purple.primary}]`}
                    />
                    <button
                        onClick={() => setTheme('turquoise')}
                        className={`w-${themeSize} h-${themeSize} bg-[${colorThemes.turquoise.primary}]`}
                    />
                </div>
                {session?.user && (
                    <div className="flex flex-row gap-2 items-center">
                        <Image
                            src={session.user.image!!}
                            alt="User Avatar"
                            width={32}
                            height={32}
                            style={{ borderRadius: '50%' }}
                        />
                        <p className="font-mono font-bold text-sm text-black dark:text-white">
                            {session.user.email}
                        </p>
                        <Button btnType="danger" onClick={() => signOut()}>
                            Sign out
                        </Button>
                    </div>
                )}
            </div>
            <div className="flex flex-row justify-center items-center w-full">
                {children}
            </div>
        </main>
    );
}
