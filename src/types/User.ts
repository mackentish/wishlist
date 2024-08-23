import { Friend, FriendRequest, List } from '.';

export type User = {
    id: number;
    name: string;
    email: string;
    lists: List[];
};

export type ShareUser = Omit<
    User,
    'id' | 'lists' | 'friends' | 'receivedRequests'
>;

export type GetUserResponse = Omit<User, 'lists'>;
