import { ShareGroup } from '@/types';
import prisma from './_base';

export async function getShareGroups(userId: number): Promise<ShareGroup[]> {
    // get user owned share groups
    const shareGroups = await prisma.shareGroup.findMany({
        where: { ownerId: userId },
        include: {
            members: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
        },
    });

    return shareGroups;
}

export async function createShareGroup(
    userId: number,
    name: string,
    description: string | null,
    memberEmails: string[]
): Promise<ShareGroup> {
    // Find users for member emails (rely on FE to only allow selection of existing Friends)
    const memberIds = await prisma.user.findMany({
        where: {
            email: {
                in: memberEmails,
            },
        },
        select: {
            id: true,
        },
    });

    const shareGroup = await prisma.shareGroup.create({
        data: {
            name,
            description,
            ownerId: userId,
            members: {
                connect: memberIds,
            },
        },
        include: {
            members: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
        },
    });

    return shareGroup;
}

export async function editShareGroup(
    userId: number,
    id: number,
    name: string,
    description: string | null,
    memberEmails: string[]
): Promise<ShareGroup> {
    // Ensure user owns share group
    const shareGroup = await prisma.shareGroup.findFirst({
        where: {
            id,
            ownerId: userId,
        },
    });

    if (!shareGroup) {
        throw new Error(
            'Share group not found or user does not own share group'
        );
    }

    // Find users for member emails (rely on FE to only allow selection of existing Friends)
    const memberIds = await prisma.user.findMany({
        where: {
            email: {
                in: memberEmails,
            },
        },
        select: {
            id: true,
        },
    });

    const updatedGroup = await prisma.shareGroup.update({
        where: { id },
        data: {
            name,
            description,
            members: {
                set: memberIds,
            },
        },
        include: {
            members: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
        },
    });

    return updatedGroup;
}

export async function deleteShareGroup(
    userId: number,
    id: number
): Promise<void> {
    // Ensure user owns share group
    const shareGroup = await prisma.shareGroup.findFirst({
        where: {
            id,
            ownerId: userId,
        },
    });

    if (!shareGroup) {
        throw new Error(
            'Share group not found or user does not own share group'
        );
    }

    await prisma.shareGroup.delete({
        where: { id },
    });
}
