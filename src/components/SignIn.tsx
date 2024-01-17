import React from "react";
import { Button } from "@/components";
import { signIn } from "next-auth/react";

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
      <Button
        onClick={async () => {
          const endpoint = "/data-api/rest/user";
          const response = await fetch(endpoint);
          const data = await response.json();
          console.table(data.value);
        }}
      >
        TEST
      </Button>
    </div>
  );
}
