import { List } from "..";

export type UserResponseData = {
  id: number;
  name: string;
  email: string;
  lists: List[];
  // sharedLists: List[];
};
