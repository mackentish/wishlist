import { List, Menu } from "../components";
import { ListItem as ListItemType } from "../types";

export default function Home() {
  const mockItems: ListItemType[] = [
    {
      id: 1,
      name: "Jersey",
      url: "https://google.com/search?q=jersey",
      note: "A test note about this item",
      isBought: false,
    },
    {
      id: 2,
      name: "Two front teeth",
      url: "https://google.com/search?q=two+front+teeth",
      isBought: false,
    },
    {
      id: 3,
      name: "Hippopotamus",
      url: "https://google.com/search?q=hippopotamus",
      isBought: true,
    },
  ];

  return (
    <main className="flex flex-row min-h-screen min-w-screen">
      <Menu />
      <div className="flex flex-row justify-center items-center w-full">
        <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
          <code className="font-mono font-bold text-3xl">wishlist</code>
          <List isOwner={true} items={mockItems} />
          <List isOwner={false} items={mockItems} />
        </div>
      </div>
    </main>
  );
}