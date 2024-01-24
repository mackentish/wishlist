import { getSessionUser, shareList } from '@/repo'
import { ShareListRequest } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }

    const existingUser = await getSessionUser(req, res)
    // if no user, return unauthorized
    if (!existingUser) {
        res.status(401).json({ error: 'No user found, unauthorized.' })
        return
    }

    // validate data
    const data = JSON.parse(req.body) as ShareListRequest
    if (!data.listId || !data.sharedUserEmails) {
        res.status(400).json({ error: 'Invalid data' })
        return
    }
    data.sharedUserEmails = data.sharedUserEmails.filter(
        (u) => u !== existingUser.email
    )
    if (!data.sharedUserEmails.length) {
        res.status(400).json({ error: 'No valid emails to share with' })
        return
    }

    await shareList(data.listId, data.sharedUserEmails, existingUser.id)

    res.status(200).json({ message: 'List created' })
    return
}
