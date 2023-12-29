import { ListItem } from ".";

export type List = {
  id: number;
  userId: number;
  name: string;
  description?: string;
  items: ListItem[];
};

export type CreateListRequest = Omit<List, "id" | "userId" | "items">;
