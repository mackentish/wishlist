import { deletePurchasedItems, getSessionUser } from '@/repo';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string }>
) {
    try {
        // find user
        const existingUser = await getSessionUser(req, res);
        if (!existingUser) {
            res.status(404).json({ message: 'No user found, unauthorized.' });
            return;
        }

        // DELETE purchased items for a list
        if (req.method === 'DELETE') {
            const { listId, sendEmail } = JSON.parse(req.body);
            await deletePurchasedItems(listId, sendEmail, existingUser.email);
            res.status(200).json({ message: 'Friend deleted' });
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
