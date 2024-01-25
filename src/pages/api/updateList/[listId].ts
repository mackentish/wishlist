import { getSessionUser, updateListById } from '@/repo';
import { CreateListRequest } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'PUT') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    // find user
    const existingUser = await getSessionUser(req, res);
    if (!existingUser) {
        res.status(401).json({ message: 'No user found, unauthorized.' });
        return;
    }

    // validate data
    const data = JSON.parse(req.body) as CreateListRequest;
    if (!data.name) {
        res.status(400).json({ message: 'Invalid data' });
        return;
    }

    // delete list
    const listId = Number.parseInt(req.query.listId as string);
    const success = await updateListById(listId, data, existingUser.id);
    if (success) {
        res.status(200).json({ message: 'List updated' });
    } else {
        res.status(404).json({ message: 'List not found for user' });
    }
    return;
}
