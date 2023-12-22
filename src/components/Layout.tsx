import React from "react";
import { Button, Menu } from ".";
import { signOut, useSession } from "next-auth/react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  return (
    <main className="flex flex-row min-h-screen min-w-screen">
      {session?.user && <Menu />}
      <div className="flex flex-row justify-center items-center w-full">
        {children}
      </div>
      {session?.user && (
        <div className="absolute top-4 right-4 w-50">
          <Button btnType="danger" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      )}
    </main>
  );
}
