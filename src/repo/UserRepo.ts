import { GetUserResponse, ShareUser, User } from '@/types';
import { normalizeEmail } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import prisma from './_base';

export async function getSessionUser(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<Omit<User, 'lists' | 'receivedRequests' | 'friends'> | null> {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
        return null;
    }

    // find user
    const existingUser = await prisma.user.findFirst({
        where: {
            email: { equals: session.user.email, mode: 'insensitive' },
        },
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
    const existingUser = await prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
        include: {
            lists: { include: { items: true } },
        },
    });

    if (existingUser) {
        // check for name change
        if (existingUser.name !== name) {
            await prisma.user.update({
                where: { id: existingUser.id },
                data: { name },
            });
            existingUser.name = name;
        }

        // update last login
        await prisma.user.update({
            where: { id: existingUser.id },
            data: { lastLogin: new Date() },
        });

        // return existing user
        return existingUser;
    }
    // create user
    else {
        const newUser = await prisma.user.create({
            data: {
                email: normalizeEmail(email),
                name,
            },
        });

        // update any shared lists with new user
        await prisma.sharedList.updateMany({
            where: { sharedEmail: { equals: email, mode: 'insensitive' } },
            data: { sharedUserId: newUser.id, sharedEmail: null },
        });

        // update any friend requests with new user email
        await prisma.friendRequest.updateMany({
            where: { email: { equals: email, mode: 'insensitive' } },
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
            NOT: { email: { equals: email, mode: 'insensitive' } },
        },
    });
}
