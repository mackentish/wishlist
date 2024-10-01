import { findOrCreateUser } from '@/repo';
import { GetUserResponse } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GetUserResponse | { message: string }>
) {
    if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);
        if (!session?.user?.email || !session?.user?.name) {
            res.status(400).json({ message: 'Invalid session' });
            return;
        }

        const user = await findOrCreateUser(
            session.user.email,
            session.user.name
        );
        res.status(200).json(user);

        return;
    }

    // Default response
    else {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }
}
