import { Prisma } from '@prisma/client';

export type ListItem = {
    id: number;
    name: string;
    note: string | null;
    link: string | null;
    price: Prisma.Decimal | null;
    boughtBy: { name: string; email: string } | null;
    listId: number;
};

export type CreateListItemRequest = Omit<ListItem, 'id' | 'boughtBy'>;

export type UpdateListItemRequest = Omit<ListItem, 'id'>;

export type ToggleBoughtRequest = {
    itemId: number;
    purchase: boolean;
};
