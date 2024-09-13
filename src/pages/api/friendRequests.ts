import {
    getFriendRequests,
    getSessionUser,
    sendFriendRequest,
    updateFriendRequest,
} from '@/repo';
import { FriendRequest } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

// NOTE: I'm starting a new pattern with this file where one handler can handle multiple methods.
// If I like it, I'll update the other handlers to use this pattern when I have the time.
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<FriendRequest[] | { message: string }>
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
            const requests = await getFriendRequests(existingUser.id);
            res.status(200).json(requests);
            return;
        }

        // POST friend request
        else if (req.method === 'POST') {
            // get email from body
            const { email } = JSON.parse(req.body);
            if (!email) {
                res.status(400).json({ message: 'Email is required' });
                return;
            }

            // send friend request
            await sendFriendRequest(existingUser.id, email);
            res.status(200).json({ message: 'Friend request sent' });
            return;
        }

        // PUT friend request
        else if (req.method === 'PUT') {
            // get requestId and accept from body
            const { requestId, accept } = JSON.parse(req.body);
            if (!requestId || accept === undefined) {
                res.status(400).json({
                    message: 'Request ID and accept are required',
                });
                return;
            }

            // update friend request
            await updateFriendRequest(existingUser, requestId, accept);
            res.status(200).json({ message: 'Friend request updated' });
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
