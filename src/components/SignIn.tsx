import { Button, CircularSpinner, FadeIn, Header } from '@/components';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);

    const signUserIn = () => {
        setIsLoading(true);
        signIn('google');
    };

    return (
        <FadeIn className="flex flex-col gap-8 items-center w-full">
            {isLoading ? (
                <div className="flex flex-row gap-4">
                    <p className="text-xl text-black dark:text-white">
                        Signing you in...
                    </p>
                    <CircularSpinner />
                </div>
            ) : (
                <p className="text-xl text-black dark:text-white">
                    Not signed in
                </p>
            )}
            <Button disabled={isLoading} onClick={signUserIn}>
                Sign in
            </Button>
        </FadeIn>
    );
}
