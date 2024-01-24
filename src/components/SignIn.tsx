import { Button } from '@/components'
import { signIn } from 'next-auth/react'
import React from 'react'

export function SignIn() {
    return (
        <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
            <h1 className="font-mono font-bold text-3xl text-black dark:text-white">
                wishlist
            </h1>
            <p className="font-mono text-xl text-black dark:text-white">
                Not signed in
            </p>
            <Button onClick={() => signIn()}>Sign in</Button>
        </div>
    )
}
