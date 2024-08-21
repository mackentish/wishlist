import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useFriends() {
    const queryClient = useQueryClient();

    // Send a friend request
    const sendFriendRequest = useMutation({
        mutationFn: async (email: string) => {
            const res = await fetch('/api/sendFriendRequest', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                throw new Error('Unable to send friend request');
            }
            return res.json();
        },
        onSuccess: () => {
            // TODO: write query to fetch friends and friend requests instead of getting it with user
            // then invalidate that query
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    return { sendFriendRequest };
}
