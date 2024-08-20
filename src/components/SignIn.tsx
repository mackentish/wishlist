import {
    Button,
    CircularSpinner,
    FadeIn,
    Header,
    Typography,
} from '@/components';
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
                    <Typography type="h5">Signing you in...</Typography>
                    <CircularSpinner />
                </div>
            ) : (
                <Typography type="h5">Not signed in</Typography>
            )}
            <Button disabled={isLoading} onClick={signUserIn}>
                Sign in
            </Button>
        </FadeIn>
    );
}
