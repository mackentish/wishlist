import { ShareUser } from './User';

export type ShareGroup = {
    id: number;
    name: string;
    description: string | null;
    members: ShareUser[];
};

export type CreateShareGroup = {
    name: string;
    description: string | null;
    memberEmails: string[];
};
