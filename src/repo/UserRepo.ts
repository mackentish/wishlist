import { GetUserResponse, ShareUser, User } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { prisma } from './_base'

export async function getSessionUser(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<Omit<User, 'lists'> | null> {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.email) {
        return null
    }

    // find user
    const existingUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    })
    if (!existingUser) {
        return null
    }
    return existingUser
}

export async function findOrCreateUser(
    email: string,
    name: string
): Promise<GetUserResponse> {
    // find or create user
    const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { lists: { include: { items: true } } },
    })
    if (existingUser) {
        return existingUser
    } else {
        // create user
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
            },
        })
        // return it
        return newUser
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
    })
}
