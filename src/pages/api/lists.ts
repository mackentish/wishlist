import { createList, getListsForUser, getSessionUser } from '@/repo';
import { CreateListRequest, List } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<List[] | { message: string }>
) {
    try {
        // find user
        const existingUser = await getSessionUser(req, res);
        if (!existingUser) {
            res.status(404).json({ message: 'No user found, unauthorized.' });
            return;
        }

        // GET lists for user
        if (req.method === 'GET') {
            const lists = await getListsForUser(existingUser.id);
            res.status(200).json(lists);
            return;
        }

        // POST create list
        else if (req.method === 'POST') {
            // validate data
            const data = JSON.parse(req.body) as CreateListRequest;
            if (!data.name) {
                res.status(400).json({ message: 'Invalid data' });
                return;
            }

            await createList(data, existingUser.id);

            res.status(200).json({ message: 'List created' });
            return;
        }

        // Default response for non-matched methods
        else {
            res.status(405).json({ message: 'Method not allowed' });
            return;
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
