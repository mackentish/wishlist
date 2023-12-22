import { ErrorView, List, SignIn } from "@/components";
import { useUser } from "@/hooks";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { isLoading, error, data: user } = useUser();

  if (!session?.user) {
    return <SignIn />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
        <h1>
          <code className="font-mono font-bold text-3xl">wishlist</code>
        </h1>
        <p className="font-mono text-xl">Loading...</p>
      </div>
    );
  }

  if (error || !user) {
    return <ErrorView />;
  }

  return (
    <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
      <h1>
        <code className="font-mono font-bold text-3xl">wishlist</code>
      </h1>
      <p className="font-mono text-xl">
        Signed in as: <code className="font-bold">{session.user.email}</code>
      </p>
      {user.lists
        .filter((list) => list.userId === user.id)
        .map((list, index) => (
          <List
            key={`${index}-${list.name}`}
            isOwner={true}
            items={list.items}
          />
        ))}
    </div>
  );
}
