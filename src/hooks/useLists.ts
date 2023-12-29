import { useQuery, useMutation } from "@tanstack/react-query";
import {
  List,
  CreateListRequest,
  ListItem,
  CreateListItemRequest,
} from "@/types";

export function useLists() {
  /**
   * Fetches all lists both belonging to the user and shared with the user
   */
  const fetchLists = useQuery<List[]>({
    queryKey: ["lists"],
    queryFn: async () => {
      const res = await fetch("/api/getLists");
      const data = await res.json();
      return data;
    },
  });

  /**
   * Creates a new list belonging to the user
   */
  const createList = useMutation({
    mutationFn: async (newList: CreateListRequest) => {
      await fetch("/api/postList", {
        method: "POST",
        body: JSON.stringify(newList),
      });
    },
    onSuccess: () => {
      fetchLists.refetch();
    },
  });

  /**
   * Updates a list belonging to the user
   */
  const addListItem = useMutation({
    mutationFn: async (item: CreateListItemRequest) => {
      await fetch("/api/postListItem", {
        method: "POST",
        body: JSON.stringify(item),
      });
    },
    onSuccess: () => {
      fetchLists.refetch();
    },
  });

  return { fetchLists, createList, addListItem };
}
