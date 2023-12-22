import { Button, ErrorView, List } from "@/components";
import { useUser } from "@/hooks";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { isLoading, error, data: user } = useUser();

  if (!session?.user) {
    return (
      <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
        <h1>
          <code className="font-mono font-bold text-3xl">wishlist</code>
        </h1>
        <p className="font-mono text-xl">Not signed in</p>
        <Button onClick={() => signIn()}>Sign in</Button>
      </div>
    );
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
      <List isOwner={true} items={user.lists[0].items} />
      <List isOwner={false} items={user.lists[0].items} />
      <div className="absolute top-4 right-4 w-50">
        <Button btnType="danger" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
