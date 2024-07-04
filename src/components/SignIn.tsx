import { Button, Header } from '@/components';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);

    const signUserIn = () => {
        setIsLoading(true);
        signIn('google');
    };

    return (
        <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
            <Header />
            <p className="text-xl text-black dark:text-white">Not signed in</p>
            <Button disabled={isLoading} onClick={signUserIn}>
                Sign in
            </Button>
        </div>
    );
}
