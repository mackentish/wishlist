import { GetUserResponse, ShareUser, User } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { prisma } from './_base';

export async function getSessionUser(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<Omit<User, 'lists' | 'receivedRequests' | 'friends'> | null> {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
        return null;
    }

    // find user
    const existingUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });
    if (!existingUser) {
        return null;
    }
    return existingUser;
}

export async function findOrCreateUser(
    email: string,
    name: string
): Promise<GetUserResponse> {
    // find or create user
    const existingUser = await prisma.user.findUnique({
        where: { email },
        include: {
            lists: { include: { items: true } },
        },
    });

    // check for name change
    if (existingUser && existingUser.name !== name) {
        await prisma.user.update({
            where: { email },
            data: { name },
        });
        existingUser.name = name;
    }

    // return existing user
    if (existingUser) {
        return existingUser;
    }
    // create user
    else {
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
            },
        });

        // update any shared lists with new user
        await prisma.sharedList.updateMany({
            where: { sharedEmail: email },
            data: { sharedUserId: newUser.id, sharedEmail: null },
        });

        // update any friend requests with new user email
        await prisma.friendRequest.updateMany({
            where: { email },
            data: { receiverId: newUser.id },
        });

        return newUser;
    }
}

export async function getShareableUsers(email: string): Promise<ShareUser[]> {
    return await prisma.user.findMany({
        select: {
            id: false,
            email: true,
            name: true,
        },
        where: {
            email: {
                not: email,
            },
        },
    });
}
