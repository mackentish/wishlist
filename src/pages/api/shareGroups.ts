import {
    createShareGroup,
    deleteShareGroup,
    editShareGroup,
    getSessionUser,
    getShareGroups,
} from '@/repo';
import { CreateShareGroup, ShareGroup } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ShareGroup[] | { message: string }>
) {
    try {
        // find user
        const existingUser = await getSessionUser(req, res);
        if (!existingUser) {
            res.status(404).json({ message: 'No user found, unauthorized.' });
            return;
        }

        // GET share groups for user
        if (req.method === 'GET') {
            const shareGroups = await getShareGroups(existingUser.id);
            res.status(200).json(shareGroups);
            return;
        }

        // POST create share group
        if (req.method === 'POST') {
            const { name, description, memberEmails } = JSON.parse(
                req.body
            ) as CreateShareGroup;
            await createShareGroup(
                existingUser.id,
                name,
                description,
                memberEmails
            );
            res.status(201).json({ message: 'Share group created' });
            return;
        }

        // PUT edit share group
        if (req.method === 'PUT') {
            const { id, name, description, memberEmails } = JSON.parse(
                req.body
            );
            await editShareGroup(
                existingUser.id,
                id,
                name,
                description,
                memberEmails
            );
            res.status(201).json({ message: 'Share Group updated' });
            return;
        }

        // DELETE share group
        if (req.method === 'DELETE') {
            const { id } = JSON.parse(req.body);
            await deleteShareGroup(existingUser.id, id);
            res.status(201).json({ message: 'Share group deleted' });
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
