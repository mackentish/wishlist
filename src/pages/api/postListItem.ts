import { createItem, getSessionUser } from '@/repo';
import { CreateListItemRequest } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    const existingUser = await getSessionUser(req, res);
    if (!existingUser) {
        res.status(401).json({ message: 'No user found, unauthorized.' });
        return;
    }

    // validate data
    const data = JSON.parse(req.body) as CreateListItemRequest;
    if (
        !data.listId ||
        !data.name ||
        !data.link ||
        data.isBought === undefined
    ) {
        res.status(400).json({ message: 'Invalid data' });
        return;
    }

    const success = await createItem(data, existingUser.id);
    if (success) {
        res.status(201).json({ message: 'Item created' });
    } else {
        res.status(401).json({
            message: 'No list found for user, unauthorized.',
        });
    }
    return;
}
