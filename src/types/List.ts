import { ListItem, ShareUser } from '.';

export type List = {
    id: number;
    userId: number;
    user?: { name: string };
    name: string;
    description: string | null;
    items: ListItem[];
    sharedUsers: ShareUser[];
};

export type CreateListRequest = Omit<
    List,
    'id' | 'userId' | 'items' | 'sharedUsers'
>;

export type ShareListRequest = {
    listId: number;
    sharedUserEmails: string[];
    unsharedUserEmails: string[];
};
