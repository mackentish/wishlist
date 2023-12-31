export type ListItem = {
  id: number;
  name: string;
  link: string;
  note: string | null;
  isBought: boolean;
  listId: number;
};

export type CreateListItemRequest = Omit<ListItem, "id">;

export type ToggleBoughtRequest = {
  itemId: number;
  isBought: boolean;
};
