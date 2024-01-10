import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button, ErrorView, SignIn } from "@/components";
import { useLists, useSharedList, useUser } from "@/hooks";

export default function ConfirmShareList() {
  const router = useRouter();
  const { data: session } = useSession();
  const { isLoading: userLoading, error: userError } = useUser();
  const { listId } = router.query;
  const parsedId = Number.parseInt(listId as string) || undefined;
  const { addSharedList } = useLists();
  const { isLoading, error, data } = useSharedList(parsedId);

  if (!parsedId) {
    return <ErrorView />;
  }

  if (!session?.user) {
    return <SignIn />;
  }
  if (userLoading) {
    return (
      <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
        <h1 className="font-mono font-bold text-3xl text-black dark:text-white">
          wishlist
        </h1>
        <p className="font-mono text-xl text-black dark:text-white">
          Loading...
        </p>
      </div>
    );
  }

  if (userError) {
    return <ErrorView />;
  }

  return (
    <div className="flex flex-col gap-8 items-center w-full max-w-3xl py-20">
      <h1 className="font-mono text-3xl text-black dark:text-white">
        Confirm Shared List
      </h1>
      {isLoading && (
        <p className="font-mono text-xl text-black dark:text-white">
          Loading...
        </p>
      )}
      {error && (
        <p className="font-mono text-xl text-error">Error: {error.message}</p>
      )}
      {data && (
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xl text-black dark:text-white">
            {data.userName} has shared their list with you:
          </p>
          <div className="flex flex-col border rounded border-black dark:border-white border-opacity-40 p-4">
            <p className="font-mono font-bold text-md text-black dark:text-white">
              {data.listName}
            </p>
            <p className="font-mono text-xs text-black dark:text-lightGrey">
              {data.listDescription}
            </p>
          </div>
          <p className="font-mono text-xl text-black dark:text-white">
            Would you like to add their list to your account?
          </p>
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => {
                addSharedList.mutate(parsedId, {
                  onSuccess: () => {
                    router.push("/");
                  },
                  onError: (error) => {
                    console.error(error);
                    alert("Error adding shared list");
                  },
                });
              }}
            >
              Yes
            </Button>
            <Button btnType="secondary" onClick={() => router.push("/")}>
              No
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
