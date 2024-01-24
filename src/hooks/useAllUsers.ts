import { ShareUser } from '@/types'
import { UseQueryResult, useQuery } from '@tanstack/react-query'

export function useAllUsers(): UseQueryResult<ShareUser[]> {
    return useQuery({
        queryKey: ['shareUsers'],
        queryFn: async () => {
            const res = await fetch('/api/getShareUsers')
            if (!res.ok) {
                throw new Error('Unable to fetch users to share with')
            }
            return res.json()
        },
    })
}
