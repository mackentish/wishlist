import { Button, List } from "@/components";
import { mockUserResponse } from "@/__mocks__";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const mockItems = mockUserResponse.lists[0].items;
  const { data: session } = useSession();

  if (!session || !session.user)
    return (
      <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
        <h1>
          <code className="font-mono font-bold text-3xl">wishlist</code>
        </h1>
        <p className="font-mono text-xl">Not signed in</p>
        <Button onClick={() => signIn()}>Sign in</Button>
      </div>
    );

  return (
    <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
      <h1>
        <code className="font-mono font-bold text-3xl">wishlist</code>
      </h1>
      <p className="font-mono text-xl">
        Signed in as: <code className="font-bold">{session.user.email}</code>
      </p>
      <Button onClick={() => signOut()}>Sign out</Button>
      <List isOwner={true} items={mockItems} />
      <List isOwner={false} items={mockItems} />
    </div>
  );
}
