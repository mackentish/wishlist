import { deleteListById, getSessionUser } from '@/repo'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'DELETE') {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }

    // find user
    const existingUser = await getSessionUser(req, res)
    if (!existingUser) {
        res.status(401).json({ message: 'No user found, unauthorized.' })
        return
    }

    // delete list
    const listId = Number.parseInt(req.query.listId as string)
    const success = await deleteListById(listId, existingUser.id)
    if (success) {
        res.status(200).json({ message: 'List deleted' })
    } else {
        res.status(404).json({ message: 'List not found for user' })
    }
    return
}
