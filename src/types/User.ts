import { Friend, FriendRequest, List } from '.';

export type User = {
    id: number;
    name: string;
    email: string;
    lists: List[];
};

export type ShareUser = {
    name: string;
    email: string;
};
export type GetUserResponse = Omit<User, 'lists'>;
