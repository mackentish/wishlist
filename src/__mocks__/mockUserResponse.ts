import { UserResponseData } from "@/types/api";

export const mockUserResponse: UserResponseData = {
  id: 1,
  name: "Brandon Trzepacz Tish",
  email: "brandon.tish@gmail.com",
  lists: [
    {
      id: 1,
      userId: 1,
      name: "Brandon's Christmas List",
      description: "What I want for Christmas",
      items: [
        {
          id: 1,
          name: "Jersey",
          url: "https://google.com/search?q=jersey",
          note: "A test note about this item",
          isBought: false,
        },
        {
          id: 2,
          name: "Two front teeth",
          url: "https://google.com/search?q=two+front+teeth",
          isBought: false,
        },
        {
          id: 3,
          name: "Hippopotamus",
          url: "https://google.com/search?q=hippopotamus",
          isBought: true,
        },
      ],
    },
    {
      id: 2,
      userId: 1,
      name: "Brandon's Birthday List",
      description: "What I want for Christmas",
      items: [
        {
          id: 1,
          name: "Big ol' cake",
          url: "https://google.com/search?q=jersey",
          note: "A test note about this item",
          isBought: false,
        },
        {
          id: 2,
          name: "Some discs or somethin'",
          url: "https://google.com/search?q=two+front+teeth",
          isBought: false,
        },
        {
          id: 3,
          name: "Birthday Hippopotamus",
          url: "https://google.com/search?q=hippopotamus",
          isBought: true,
        },
      ],
    },
  ],
  sharedLists: [
    {
      id: 3,
      userId: 2,
      name: "Katie's Christmas List",
      description: "What I want for Christmas",
      items: [
        {
          id: 1,
          name: "Jersey",
          url: "https://google.com/search?q=jersey",
          note: "A test note about this item",
          isBought: false,
        },
        {
          id: 2,
          name: "Two front teeth",
          url: "https://google.com/search?q=two+front+teeth",
          isBought: false,
        },
        {
          id: 3,
          name: "Hippopotamus",
          url: "https://google.com/search?q=hippopotamus",
          isBought: true,
        },
      ],
    },
  ],
};
