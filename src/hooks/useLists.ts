import { useQuery, useMutation } from "@tanstack/react-query";
import {
  List,
  CreateListRequest,
  CreateListItemRequest,
  ListItem,
  ToggleBoughtRequest,
} from "@/types";

export function useLists() {
  /**
   * Fetches all lists both belonging to the user and shared with the user
   */
  const fetchLists = useQuery<List[]>({
    queryKey: ["lists"],
    queryFn: async () => {
      const res = await fetch("/api/getLists");

      if (!res.ok) {
        throw new Error("Unable to fetch lists");
      }
      return res.json();
    },
  });

  /**
   * Creates a new list belonging to the user
   */
  const createList = useMutation({
    mutationFn: async (newList: CreateListRequest) => {
      const res = await fetch("/api/postList", {
        method: "POST",
        body: JSON.stringify(newList),
      });

      if (!res.ok) {
        throw new Error("Unable to create list");
      }
      return res.json();
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
      const res = await fetch("/api/postListItem", {
        method: "POST",
        body: JSON.stringify(item),
      });

      if (!res.ok) {
        throw new Error("Unable to add list item");
      }
      return res.json();
    },
    onSuccess: () => {
      fetchLists.refetch();
    },
  });

  /**
   * Deletes a list item belonging to the user
   */
  const deleteListItem = useMutation({
    mutationFn: async (itemId: number) => {
      const res = await fetch(`/api/deleteItem/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Unable to delete list item");
      }
      return res.json();
    },
    onSuccess: () => {
      fetchLists.refetch();
    },
  });

  /**
   * Deletes a list belonging to the user
   */
  const deleteList = useMutation({
    mutationFn: async (listId: number) => {
      const res = await fetch(`/api/deleteList/${listId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Unable to delete list");
      }
      return res.json();
    },
    onSuccess: () => {
      fetchLists.refetch();
    },
  });

  /**
   * Updates a list item belonging to the user
   */
  const updateListItem = useMutation({
    mutationFn: async (item: ListItem) => {
      const res = await fetch(`/api/updateItem/${item.id}`, {
        method: "PUT",
        body: JSON.stringify(item),
      });

      if (!res.ok) {
        throw new Error("Unable to update list item");
      }
      return res.json();
    },
    onSuccess: () => {
      fetchLists.refetch();
    },
  });

  /**
   * Marks a list item as bought
   */
  const toggleItemBought = useMutation({
    mutationFn: async (data: ToggleBoughtRequest) => {
      const res = await fetch(`/api/boughtItem/${data.itemId}`, {
        method: "PUT",
        body: JSON.stringify({ isBought: data.isBought }),
      });

      if (!res.ok) {
        throw new Error("Unable to mark item as bought");
      }
      return res.json();
    },
    onSuccess: () => {
      fetchLists.refetch();
    },
  });

  /**
   * Updates a list belonging to the user
   */
  const updateList = useMutation({
    mutationFn: async (list: List) => {
      const res = await fetch(`/api/updateList/${list.id}`, {
        method: "PUT",
        body: JSON.stringify(list),
      });

      if (!res.ok) {
        throw new Error("Unable to update list");
      }
      return res.json();
    },
    onSuccess: () => {
      fetchLists.refetch();
    },
  });

  /**
   * Add shared list to user's account
   */
  const addSharedList = useMutation({
    mutationFn: async (listId: number) => {
      const res = await fetch(`/api/addSharedList/${listId}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Unable to add shared list");
      }
      return res.json();
    },
    onSuccess: () => {
      fetchLists.refetch();
    },
    retry: false,
  });

  return {
    fetchLists,
    createList,
    addListItem,
    deleteListItem,
    updateListItem,
    toggleItemBought,
    deleteList,
    updateList,
    addSharedList,
  };
}
