import { CreateListItemRequest, UpdateListItemRequest } from '@/types';
import prisma from './_base';

export async function deleteItemById(
    itemId: number,
    userId: number
): Promise<boolean> {
    const item = await prisma.listItem.findUnique({ where: { id: itemId } });
    // verify user owns list item
    const list = await prisma.list.findUnique({
        where: { id: item?.listId, userId: userId },
    });
    if (!item || !list) {
        return false;
    }

    // delete list item
    await prisma.listItem.delete({ where: { id: item.id } });
    return true;
}

export async function createItem(
    data: CreateListItemRequest,
    userId: number
): Promise<boolean> {
    // validate that list belongs to user
    const list = await prisma.list.findUnique({
        where: { id: data.listId, userId },
    });
    // if not, throw 401
    if (!list) {
        return false;
    }

    // create list item
    await prisma.listItem.create({
        data: {
            name: data.name,
            link: data.link,
            note: data.note,
            price: data.price,
            list: { connect: { id: data.listId } },
        },
    });
    return true;
}

export async function updateItemById(
    itemId: number,
    data: UpdateListItemRequest,
    userId: number
): Promise<boolean> {
    // validate that list belongs to user
    const list = await prisma.list.findUnique({
        where: { id: data.listId, userId },
    });
    if (!list) {
        return false;
    }

    // get boughtBy user by email if not null
    let boughtByUser = null;
    if (data.boughtBy?.email) {
        boughtByUser = await prisma.user.findUnique({
            where: { email: data.boughtBy.email },
            select: { id: true },
        });
    }

    // update list item
    const updatedItem = await prisma.listItem.update({
        where: { id: itemId },
        data: {
            name: data.name,
            link: data.link,
            note: data.note,
            price: data.price,
            boughtById: boughtByUser?.id ?? null,
        },
    });

    if (updatedItem) {
        return true;
    } else {
        return false;
    }
}

export async function toggleBought(
    itemId: number,
    userId: number,
    boughtByEmail: string | null
): Promise<boolean> {
    // find list containing item
    const item = await prisma.listItem.findUnique({ where: { id: itemId } });
    if (!item) {
        return false;
    }
    const list = await prisma.list.findUnique({ where: { id: item.listId } });
    if (!list) {
        return false;
    }

    // validate that list has been shared with user
    const sharedList = await prisma.sharedList.findFirst({
        where: { listId: list.id, sharedUserId: userId },
    });
    if (!sharedList) {
        return false;
    }

    // get boughtBy user by email if not null
    let boughtByUser = null;
    if (boughtByEmail) {
        boughtByUser = await prisma.user.findUnique({
            where: { email: boughtByEmail },
            select: { id: true },
        });
    }

    // update list item
    const updatedItem = await prisma.listItem.update({
        where: { id: itemId },
        data: {
            boughtById: boughtByUser?.id ?? null,
        },
    });

    if (updatedItem) {
        return true;
    } else {
        return false;
    }
}
