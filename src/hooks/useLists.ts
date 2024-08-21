import {
    CreateListItemRequest,
    CreateListRequest,
    List,
    ListItem,
    ShareListRequest,
    ToggleBoughtRequest,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useLists(enabled = true) {
    const queryClient = useQueryClient();

    /**
     * Fetches all lists both belonging to the user and shared with the user
     */
    const fetchLists = useQuery<List[]>({
        queryKey: ['lists'],
        queryFn: async () => {
            const res = await fetch('/api/getLists');

            if (!res.ok) {
                throw new Error('Unable to fetch lists');
            }
            return res.json();
        },
        enabled: enabled,
    });

    /**
     * Creates a new list belonging to the user
     */
    const createList = useMutation({
        mutationFn: async (newList: CreateListRequest) => {
            const res = await fetch('/api/postList', {
                method: 'POST',
                body: JSON.stringify(newList),
            });

            if (!res.ok) {
                throw new Error('Unable to create list');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });

    /**
     * Updates a list belonging to the user
     */
    const addListItem = useMutation({
        mutationFn: async (item: CreateListItemRequest) => {
            const res = await fetch('/api/postListItem', {
                method: 'POST',
                body: JSON.stringify(item),
            });

            if (!res.ok) {
                throw new Error('Unable to add list item');
            }
            return res.json();
        },
        onSuccess: () => {
            console.log('test 1');
            queryClient.invalidateQueries({ queryKey: ['lists'] });
            console.log('test 2');
        },
    });

    /**
     * Deletes a list item belonging to the user
     */
    const deleteListItem = useMutation({
        mutationFn: async (itemId: number) => {
            const res = await fetch(`/api/deleteItem/${itemId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Unable to delete list item');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });

    /**
     * Deletes a list belonging to the user
     */
    const deleteList = useMutation({
        mutationFn: async (listId: number) => {
            const res = await fetch(`/api/deleteList/${listId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Unable to delete list');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });

    /**
     * Updates a list item belonging to the user
     */
    const updateListItem = useMutation({
        mutationFn: async (item: ListItem) => {
            const res = await fetch(`/api/updateItem/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify(item),
            });

            if (!res.ok) {
                throw new Error('Unable to update list item');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });

    /**
     * Marks a list item as bought
     */
    const toggleItemBought = useMutation({
        mutationFn: async (data: ToggleBoughtRequest) => {
            const res = await fetch(`/api/boughtItem/${data.itemId}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Unable to mark item as bought');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });

    /**
     * Updates a list belonging to the user
     */
    const updateList = useMutation({
        mutationFn: async (list: List) => {
            const res = await fetch(`/api/updateList/${list.id}`, {
                method: 'PUT',
                body: JSON.stringify(list),
            });

            if (!res.ok) {
                throw new Error('Unable to update list');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });

    /**
     * Shares and/or un-shares a list with other users
     */
    const shareList = useMutation({
        mutationFn: async (data: ShareListRequest) => {
            const res = await fetch('/api/shareList', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Unable to share list');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });

    /**
     * Removes the link between a list and a user it's shared with
     */
    const deleteSharedList = useMutation({
        mutationFn: async (listId: number) => {
            const res = await fetch(`/api/deleteSharedList`, {
                method: 'DELETE',
                body: JSON.stringify({ listId }),
            });

            if (!res.ok) {
                throw new Error('Unable to remove shared list');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
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
        shareList,
        deleteSharedList,
    };
}
