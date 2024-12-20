import {
    CreateListItemRequest,
    CreateListRequest,
    List,
    ListItem,
    RemovePurchasedItemsRequest,
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
            const res = await fetch('/api/lists');

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
            const res = await fetch('/api/lists', {
                method: 'POST',
                body: JSON.stringify(newList),
            });

            if (!res.ok) {
                throw new Error('Unable to create list');
            }
            return res.json();
        },
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
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
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
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
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
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
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
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
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
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
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
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
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
        },
    });

    /**
     * Shares and/or un-shares a list with other users
     */
    const shareList = useMutation({
        mutationFn: async (data: ShareListRequest) => {
            const res = await fetch('/api/sharedLists', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Unable to share list');
            }
            return res.json();
        },
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
        },
    });

    /**
     * Removes the link between a list and a user it's shared with
     */
    const deleteSharedList = useMutation({
        mutationFn: async (listId: number) => {
            const res = await fetch(`/api/sharedLists`, {
                method: 'DELETE',
                body: JSON.stringify({ listId }),
            });

            if (!res.ok) {
                throw new Error('Unable to remove shared list');
            }
            return res.json();
        },
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
        },
    });

    /**
     * Removes the purchased items from a list. Optionally sends an email to the user with the removed items
     */
    const deletePurchasedItems = useMutation({
        mutationFn: async (request: RemovePurchasedItemsRequest) => {
            const res = await fetch(`/api/purchasedItems`, {
                method: 'DELETE',
                body: JSON.stringify(request),
            });

            if (!res.ok) {
                throw new Error('Unable to remove purchased items');
            }
            return res.json();
        },
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
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
        deletePurchasedItems,
    };
}
