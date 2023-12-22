import { List } from "..";

export type UserResponseData = {
  id: number;
  firstName: string;
  lastName: string;
  lists: List[];
  sharedLists: List[];
};
