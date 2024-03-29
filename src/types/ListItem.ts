export type ListItem = {
    id: number;
    name: string;
    link: string | null;
    note: string | null;
    boughtBy: { name: string; email: string } | null;
    listId: number;
};

export type CreateListItemRequest = Omit<ListItem, 'id' | 'boughtBy'>;

export type UpdateListItemRequest = Omit<ListItem, 'id'>;

export type ToggleBoughtRequest = {
    itemId: number;
    boughtByEmail: string | null;
};
