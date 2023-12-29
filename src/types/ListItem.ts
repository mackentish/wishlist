export type ListItem = {
  id: number;
  name: string;
  link: string;
  note?: string;
  isBought: boolean;
  listId: number;
};

export type CreateListItemRequest = Omit<ListItem, "id">;
