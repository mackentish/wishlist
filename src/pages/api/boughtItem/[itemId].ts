import { getSessionUser, toggleBought } from '@/repo';
import { ToggleBoughtRequest } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'PUT') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // find user
    const existingUser = await getSessionUser(req, res);
    if (!existingUser) {
        res.status(401).json({ error: 'User not found, unauthorized' });
        return;
    }

    // mark item as bought if it is shared with the user
    const itemId = Number.parseInt(req.query.itemId as string);
    const { purchase } = JSON.parse(req.body) as ToggleBoughtRequest;
    const success = await toggleBought(
        itemId,
        existingUser.id,
        purchase ? existingUser.email : null
    );
    if (success) {
        res.status(200).json({ message: 'Item bought' });
    } else {
        res.status(404).json({
            error: 'Item not found or not shared with user',
        });
    }
    return;
}
