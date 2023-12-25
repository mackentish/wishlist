import { Button, ErrorView, List, SignIn, primaryBtnClass } from "@/components";
import { useUser } from "@/hooks";
import { Pages } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const { isLoading, error, data: user } = useUser();

  if (!session?.user) {
    return <SignIn />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
        <h1 className="font-mono font-bold text-3xl">wishlist</h1>
        <p className="font-mono text-xl">Loading...</p>
      </div>
    );
  }

  if (error || !user) {
    return <ErrorView />;
  }

  return (
    <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
      <h1 className="font-mono font-bold text-3xl">wishlist</h1>

      {/* My Lists */}
      <div className="flex flex-col w-full gap-2 p-4 border rounded-md border-slate-950">
        <h2 className="font-mono font-bold text-xl">Your Lists:</h2>
        {user.lists.length > 0 ? (
          user.lists
            .filter((list) => list.userId === user.id)
            .map((list, index) => (
              <List key={`${index}-${list.name}`} isOwner items={list.items} />
            ))
        ) : (
          <div className="w-full flex flex-col gap-2">
            <p className="font-mono text-sm italic">
              No lists yet! Click the button below to get started!
            </p>
            <Link href={Pages.CreateLists} className={primaryBtnClass}>
              Create a List
            </Link>
          </div>
        )}
      </div>

      {/* Shared Lists */}
      <div className="flex flex-col w-full gap-2 p-4 border rounded-md border-slate-950">
        <h2 className="font-mono font-bold text-xl">Shared Lists:</h2>
        {user.lists.length > 0 ? (
          user.lists
            .filter((list) => list.userId !== user.id)
            .map((list, index) => (
              <List
                key={`${index}-${list.name}`}
                isOwner={false}
                items={list.items}
              />
            ))
        ) : (
          <p className="font-mono text-sm italic">
            No lists shared with you. Ask your friends to share their lists with
            you!
          </p>
        )}
      </div>
    </div>
  );
}
