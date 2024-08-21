export type Friend = {
    /** The userId of this friend */
    id: number;
    /** The name of this friend */
    name: string;
    /** The email of this friend */
    email: string;
};

export type FriendRequest = {
    /** The primary key of the request */
    id: number;
    /** The name of who sent the request */
    name: string;
    /** The email of who sent the request */
    email: string;
};
