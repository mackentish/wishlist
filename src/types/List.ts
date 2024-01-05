import { ListItem } from ".";

export type List = {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  items: ListItem[];
};

export type CreateListRequest = Omit<List, "id" | "userId" | "items">;

export type SharedListResponse = {
  userName: string;
  listName: string;
  listDescription: string | null;
};
