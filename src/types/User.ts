import { List } from ".";

export type User = {
  id: number;
  name: string;
  email: string;
  lists: List[];
};

export type ShareUser = Omit<User, "id" | "lists">;

export type GetUserResponse = Omit<User, "lists">;
