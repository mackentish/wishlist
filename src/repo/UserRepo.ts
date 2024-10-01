import { GetUserResponse, ShareUser, User } from '@/types';
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

    if (existingUser) {
        // check for name change
        if (existingUser.name !== name) {
            await prisma.user.update({
                where: { email },
                data: { name },
            });
            existingUser.name = name;
        }

        // update last login
        await prisma.user.update({
            where: { email },
            data: { lastLogin: new Date() },
        });

        // return existing user
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

// TODO: delete this after running in PROD
// add all existing users to the friends table as friends
export async function seedFriendsTable() {
    // get all users
    const users = await prisma.user.findMany({
        select: {
            id: true,
        },
    });

    // create a friend record for each unique user pair
    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users.length; j++) {
            // skip if this is the same user
            if (i === j) {
                continue;
            }

            // check for existing friendship
            const existingFriendship = await prisma.friend.findFirst({
                where: {
                    OR: [
                        { userId: users[i].id, friendId: users[j].id },
                        { userId: users[j].id, friendId: users[i].id },
                    ],
                },
            });

            // only add friendship if it doesn't already exist
            if (!existingFriendship) {
                await prisma.friend.create({
                    data: {
                        userId: users[i].id,
                        friendId: users[j].id,
                    },
                });
            }
        }
    }
}
