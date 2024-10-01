import { CreateShareGroup, ShareGroup } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useShareGroups() {
    const queryClient = useQueryClient();

    const fetchShareGroups = useQuery<ShareGroup[]>({
        queryKey: ['shareGroups'],
        queryFn: async () => {
            const res = await fetch('/api/shareGroups');
            if (!res.ok) {
                throw new Error('Unable to get share groups');
            }
            return res.json();
        },
    });

    // Create a share group
    const createShareGroup = useMutation({
        mutationFn: async (payload: CreateShareGroup) => {
            const res = await fetch('/api/shareGroups', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error('Unable to create share group');
            }
            return res.json();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['shareGroups'],
                exact: true,
            });
        },
    });

    // Edit a share group
    const editShareGroup = useMutation({
        mutationFn: async (payload: CreateShareGroup & { id: number }) => {
            const res = await fetch('/api/shareGroups', {
                method: 'PUT',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error('Unable to edit share group');
            }
            return res.json();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['shareGroups'],
                exact: true,
            });
        },
    });

    // Delete a share group
    const deleteShareGroup = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch('/api/shareGroups', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error('Unable to delete share group');
            }
            return res.json();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['shareGroups'],
                exact: true,
            });
        },
    });

    return {
        fetchShareGroups,
        createShareGroup,
        editShareGroup,
        deleteShareGroup,
    };
}
