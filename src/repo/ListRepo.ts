import { CreateListRequest, List } from '@/types'
import { prisma } from './_base'

export async function deleteListById(
    listId: number,
    userId: number
): Promise<boolean> {
    // verify list exists for user
    const list = await prisma.list.findUnique({
        where: { id: listId, userId: userId },
    })
    if (!list) {
        return false
    }

    // delete list items, the shared list entries, and the list itself
    await prisma.listItem.deleteMany({ where: { listId: list.id } })
    await prisma.sharedList.deleteMany({ where: { listId: list.id } })
    await prisma.list.delete({ where: { id: list.id } })
    return true
}

export async function getListsForUser(userId: number): Promise<List[]> {
    // find all lists associated with user
    // first, get lists owned by user
    const userLists = await prisma.list.findMany({
        where: { userId: userId },
        include: { items: true },
    })
    // next, get lists shared with user
    const sharedLists = await prisma.sharedList.findMany({
        where: { sharedUserId: userId },
        include: {
            list: {
                include: {
                    items: true,
                    user: {
                        select: { name: true },
                    },
                },
            },
        },
    })

    // combine lists and return
    return [...userLists, ...sharedLists.map((sl) => sl.list)]
}

export async function createList(
    data: CreateListRequest,
    userId: number
): Promise<void> {
    // create list
    await prisma.list.create({
        data: {
            name: data.name,
            description: data.description,
            user: { connect: { id: userId } },
        },
    })
}

export async function updateListById(
    listId: number,
    data: CreateListRequest,
    userId: number
): Promise<boolean> {
    // verify list exists for user
    const list = await prisma.list.findUnique({
        where: { id: listId, userId: userId },
    })
    if (!list) {
        return false
    }

    // update list
    await prisma.list.update({
        where: { id: list.id },
        data: {
            name: data.name,
            description: data.description,
        },
    })
    return true
}

export async function shareList(
    listId: number,
    sharedUserEmails: string[],
    userId: number
): Promise<boolean> {
    // verify list exists for user
    const list = await prisma.list.findUnique({
        where: { id: listId, userId: userId },
    })
    if (!list) {
        return false
    }

    // find user ids for emails
    const sharedUsers = await prisma.user.findMany({
        where: { email: { in: sharedUserEmails } },
        select: { id: true },
    })

    // filter out any users that already have the list shared with them
    const existingSharedUsers = await prisma.sharedList.findMany({
        where: {
            listId: list.id,
            sharedUserId: { in: sharedUsers.map((u) => u.id) },
        },
        select: { sharedUserId: true },
    })
    const netNewSharedUsers = sharedUsers.filter(
        (u) => !existingSharedUsers.map((eu) => eu.sharedUserId).includes(u.id)
    )

    // create new shared list entries
    await prisma.sharedList.createMany({
        data: netNewSharedUsers.map((user) => ({
            listId: list.id,
            sharedUserId: user.id,
        })),
    })
    return true
}

export async function deleteSharedList(
    listId: number,
    userId: number
): Promise<void> {
    // allow to find more than one here to clean up any extra relationships
    // that may have slipped through. This is a redundancy.
    await prisma.sharedList.deleteMany({
        where: { listId: listId, sharedUserId: userId },
    })
}
