import { Button, Header } from '@/components';
import { signIn } from 'next-auth/react';
import React from 'react';

export function SignIn() {
    return (
        <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
            <Header />
            <p className="text-xl text-black dark:text-white">Not signed in</p>
            <Button onClick={() => signIn('google')}>Sign in</Button>
        </div>
    );
}
