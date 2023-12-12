import { ListItem } from "./components";
import { ListItem as ListItemType } from "./types";

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
    <main className="flex min-h-screen flex-col gap-8 items-center justify-center">
      <code className="font-mono font-bold">wishlist</code>
      <div className="flex flex-col gap-2">
        {mockItems.map((item) => (
          <ListItem
            key={item.id}
            name={item.name}
            url={item.url}
            note={item.note}
          />
        ))}
      </div>
    </main>
  );
}
