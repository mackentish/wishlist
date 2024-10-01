import { Friend, FriendRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useFriends() {
    const queryClient = useQueryClient();

    const fetchFriends = useQuery<Friend[]>({
        queryKey: ['friends'],
        queryFn: async () => {
            const res = await fetch('/api/friends');
            if (!res.ok) {
                throw new Error('Unable to get friends');
            }
            return res.json();
        },
    });

    const fetchFriendRequests = useQuery<FriendRequest[]>({
        queryKey: ['friendRequests'],
        queryFn: async () => {
            const res = await fetch('/api/friendRequests');
            if (!res.ok) {
                throw new Error('Unable to get friend requests');
            }
            return res.json();
        },
    });

    // Send a friend request
    const sendFriendRequest = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            const res = await fetch('/api/friendRequests', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                throw new Error('Unable to send friend request');
            }
            return res.json();
        },
    });

    const updateFriendRequest = useMutation({
        mutationFn: async ({
            requestId,
            accept,
        }: {
            requestId: number;
            accept: boolean;
        }) => {
            const res = await fetch('/api/friendRequests', {
                method: 'PUT',
                body: JSON.stringify({ requestId, accept }),
            });

            if (!res.ok) {
                throw new Error('Unable to update friend request');
            }
            return res.json();
        },
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['friends'],
                exact: true,
            });
            await queryClient.invalidateQueries({
                queryKey: ['friendRequests'],
                exact: true,
            });
        },
    });

    const removeFriend = useMutation({
        mutationFn: async ({ friendId }: { friendId: number }) => {
            const res = await fetch('/api/friends', {
                method: 'DELETE',
                body: JSON.stringify({ friendId }),
            });

            if (!res.ok) {
                throw new Error('Unable to remove friend');
            }
            return res.json();
        },
        onSuccess: async () => {
            // have to await for it to work properly? https://stackoverflow.com/questions/68577988/invalidate-queries-doesnt-work-react-query
            await queryClient.invalidateQueries({
                queryKey: ['friends'],
                exact: true,
            });
            await queryClient.invalidateQueries({
                queryKey: ['lists'],
                exact: true,
            });
        },
    });

    return {
        fetchFriends,
        fetchFriendRequests,
        sendFriendRequest,
        updateFriendRequest,
        removeFriend,
    };
}
