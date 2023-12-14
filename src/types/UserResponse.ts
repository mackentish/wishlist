import { List } from "./List";

export type UserResponse = {
  id: number;
  firstName: string;
  lastName: string;
  lists: List[];
  sharedLists: List[];
};
