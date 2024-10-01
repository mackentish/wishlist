import { deleteSharedList, getSessionUser, shareList } from '@/repo';
import { ShareListRequest } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // find user
        const existingUser = await getSessionUser(req, res);
        if (!existingUser) {
            res.status(404).json({ message: 'No user found, unauthorized.' });
            return;
        }

        // POST share list
        if (req.method === 'POST') {
            // validate data
            const data = JSON.parse(req.body) as ShareListRequest;
            if (
                !data.listId ||
                !data.sharedUserEmails ||
                !data.unsharedUserEmails
            ) {
                res.status(400).json({ error: 'Invalid data' });
                return;
            }
            data.sharedUserEmails = data.sharedUserEmails.filter(
                (u) => u !== existingUser.email
            );

            await shareList(
                existingUser.id,
                data.listId,
                data.sharedUserEmails,
                data.unsharedUserEmails
            );

            res.status(200).json({ message: 'List shared' });
            return;
        }

        // DELETE shared list
        else if (req.method === 'DELETE') {
            // validate data
            const data = JSON.parse(req.body) as { listId: number };
            if (!data.listId) {
                res.status(400).json({ error: 'Invalid data' });
                return;
            }

            await deleteSharedList(data.listId, existingUser.id);

            res.status(200).json({ message: 'Unshared list' });
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
