import { ListItem } from ".";

export type List = {
  id: number;
  ownerId: number;
  name: string;
  description?: string;
  items: ListItem[];
};
