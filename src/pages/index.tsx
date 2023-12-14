import { List } from "@/components";
import { mockUserResponse } from "@/__mocks__";

export default function Home() {
  const mockItems = mockUserResponse.lists[0].items;
  return (
    <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
      <h1>
        <code className="font-mono font-bold text-3xl">wishlist</code>
      </h1>
      <List isOwner={true} items={mockItems} />
      <List isOwner={false} items={mockItems} />
    </div>
  );
}
