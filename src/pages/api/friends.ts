import { deleteFriend, getFriends, getSessionUser } from '@/repo';
import { Friend } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

// NOTE: I'm starting a new pattern with this file where one handler can handle multiple methods.
// If I like it, I'll update the other handlers to use this pattern when I have the time.
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Friend[] | { message: string }>
) {
    try {
        // find user
        const existingUser = await getSessionUser(req, res);
        if (!existingUser) {
            res.status(404).json({ message: 'No user found, unauthorized.' });
            return;
        }

        // GET friends for user
        if (req.method === 'GET') {
            const friends = await getFriends(existingUser.id);
            res.status(200).json(friends);
            return;
        }

        // DELETE friend
        if (req.method === 'DELETE') {
            await deleteFriend(existingUser.id, req.body.friendId);
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
