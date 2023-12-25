import React from "react";
import { Button } from "@/components";
import { signIn } from "next-auth/react";

export function SignIn() {
  return (
    <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
      <h1>
        <p className="font-mono font-bold text-3xl">wishlist</p>
      </h1>
      <p className="font-mono text-xl">Not signed in</p>
      <Button onClick={() => signIn()}>Sign in</Button>
    </div>
  );
}
