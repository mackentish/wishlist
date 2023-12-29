import { List } from ".";

export type User = {
  id: number;
  name: string;
  email: string;
  lists: List[];
  // sharedLists: List[];
};

export type GetUserResponse = Omit<User, "lists">;
