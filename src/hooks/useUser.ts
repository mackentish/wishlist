import { GetUserResponse } from '@/types';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useUser(enabled = true): UseQueryResult<GetUserResponse> {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const res = await fetch('/api/users');
            if (!res.ok) {
                throw new Error('Unable to fetch user');
            }
            return res.json();
        },
        enabled: enabled,
    });
}
