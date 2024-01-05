import { Button } from "@/components";
import { useSharedList } from "@/hooks";
import { useRouter } from "next/router";
import React from "react";

export default function ConfirmShareList() {
  const router = useRouter();
  const { listId } = router.query;
  const { isLoading, error, data } = useSharedList(
    Number.parseInt(listId as string) || undefined
  );

  return (
    <div className="flex flex-col gap-8 items-center w-full max-w-3xl py-20">
      <h1 className="font-mono text-3xl">Confirm Shared List</h1>
      {isLoading && <p className="font-mono text-xl">Loading...</p>}
      {error && <p className="font-mono text-xl">Error: {error.message}</p>}
      {data && (
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xl">
            {data.userName} has shared their list with you:
          </p>
          <div className="flex flex-col border rounded border-slate-950 p-4">
            <p className="font-mono font-bold text-md">{data.listName}</p>
            <p className="font-mono text-xs">{data.listDescription}</p>
          </div>
          <p className="font-mono text-xl">
            Would you like to add their list to your account?
          </p>
          <div className="flex flex-row gap-2">
            <Button onClick={() => alert("TODO: Add list to user")}>Yes</Button>
            <Button btnType="secondary" onClick={() => router.push("/")}>
              No
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
