import { getListsForUser, getSessionUser } from '@/repo'
import { List } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<List[] | { message: string }>
) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }

    // find user
    const existingUser = await getSessionUser(req, res)
    if (!existingUser) {
        res.status(404).json({ message: 'No user found, unauthorized.' })
        return
    }

    const lists = await getListsForUser(existingUser.id)
    res.status(200).json(lists)
    return
}
