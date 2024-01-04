import React from "react";
import { Button } from ".";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  return (
    <main className="flex flex-col min-h-screen min-w-screen p-4">
      {session?.user && (
        <div className="flex flex-row gap-2 items-center self-center lg:self-end">
          <Image
            src={session.user.image!!}
            alt="User Avatar"
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
          />
          <p className="font-mono font-bold text-sm">{session.user.email}</p>
          <Button btnType="danger" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      )}
      <div className="flex flex-row justify-center items-center w-full">
        {children}
      </div>
    </main>
  );
}
