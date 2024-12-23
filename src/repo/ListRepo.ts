import { PurchasedItemsTemplate, ShareTemplate } from '@/email-templates';
import { CreateListRequest, List, ShareUser } from '@/types';
import { Resend } from 'resend';
import { getFriends, sendFriendRequest } from './FriendRepo';
import prisma from './_base';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function deleteListById(
    listId: number,
    userId: number
): Promise<boolean> {
    // verify list exists for user
    const list = await prisma.list.findUnique({
        where: { id: listId, userId: userId },
    });
    if (!list) {
        return false;
    }

    // delete list items, the shared list entries, and the list itself
    await prisma.listItem.deleteMany({ where: { listId: list.id } });
    await prisma.sharedList.deleteMany({ where: { listId: list.id } });
    await prisma.list.delete({ where: { id: list.id } });
    return true;
}

/**
 * find all lists associated with user
 */
export async function getListsForUser(userId: number): Promise<List[]> {
    // first, get lists owned by user
    const userLists = await prisma.list.findMany({
        where: { userId: userId },
        include: {
            items: { include: { boughtBy: true }, orderBy: { name: 'asc' } },
            user: { select: { name: true } },
            shared: {
                // select who the list is shared with to display in the UI
                select: {
                    sharedUser: { select: { name: true, email: true } },
                    sharedEmail: true,
                },
            },
        },
    });

    // get list of friends
    const friendIds = (await getFriends(userId)).map((f) => f.id);

    // next, get lists shared with user FROM FRIENDS ONLY
    const sharedLists = await prisma.sharedList.findMany({
        where: {
            sharedUserId: userId,
            list: { userId: { in: friendIds } },
        },
        select: {
            list: {
                include: {
                    items: {
                        include: { boughtBy: true },
                        orderBy: { name: 'asc' },
                    },
                    user: {
                        select: { name: true },
                    },
                },
            },
        },
    });

    // populate sharedUsers for user lists
    const newUserLists: List[] = [];
    userLists.forEach((list) => {
        // map shared users to a common format for the UI
        const sharedUsers: ShareUser[] = list.shared.map((entry) => {
            if (entry.sharedUser) {
                // these are users that have an account
                return entry.sharedUser;
            } else {
                // these are users that don't have an account, but have been invited
                return {
                    name: entry.sharedEmail,
                    email: entry.sharedEmail,
                } as ShareUser;
            }
        });

        newUserLists.push({
            ...list,
            sharedUsers,
        });
    });
    // populate sharedUsers as blank for shared lists for privacy (we won't use it anyways)
    const newSharedLists: List[] = sharedLists.map((sl) => ({
        ...sl.list,
        sharedUsers: [],
    }));

    // combine lists and return
    return [
        ...newUserLists.sort((a, b) => a.name.localeCompare(b.name)),
        ...newSharedLists.sort((a, b) => a.name.localeCompare(b.name)),
    ];
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
    });
}

export async function updateListById(
    listId: number,
    data: CreateListRequest,
    userId: number
): Promise<boolean> {
    // verify list exists for user
    const list = await prisma.list.findUnique({
        where: { id: listId, userId: userId },
    });
    if (!list) {
        return false;
    }

    // update list
    await prisma.list.update({
        where: { id: list.id },
        data: {
            name: data.name,
            description: data.description,
        },
    });
    return true;
}

export async function shareList(
    userId: number,
    listId: number,
    sharedUserEmails: string[],
    unsharedUserEmails: string[]
) {
    // verify list exists for user
    const list = await prisma.list.findUnique({
        where: { id: listId, userId: userId },
        include: { user: { select: { name: true } } },
    });
    if (!list) {
        throw new Error('List not found for user!');
    }

    // get list of users who already have the list shared with them
    const existingSharedUsers = await prisma.sharedList.findMany({
        where: {
            listId: list.id,
            sharedUser: { email: { in: sharedUserEmails } },
        },
        select: { sharedUserId: true, sharedEmail: true },
    });

    // BEGIN separate emails into different types of users (friends, non-friends, new users) ------------

    // find existing friends
    const existingFriends = await prisma.friend.findMany({
        where: {
            OR: [
                {
                    userId: userId,
                    friend: { email: { in: sharedUserEmails } },
                },
                {
                    user: { email: { in: sharedUserEmails } },
                    friendId: userId,
                },
            ],
        },
        select: {
            friend: { select: { id: true, email: true, name: true } },
            user: { select: { id: true, email: true, name: true } },
        },
    });
    let mappedExistingFriends = existingFriends.map((f) => {
        if (f.friend.id === userId) {
            return f.user;
        }
        return f.friend;
    });

    // find existing users who just aren't a friend yet
    let existingNonFriends = await prisma.user.findMany({
        where: {
            email: { in: sharedUserEmails },
            id: {
                notIn: mappedExistingFriends.map((f) => f.id),
            },
        },
        select: { id: true, email: true, name: true },
    });

    // find net new users who don't have an account
    // using friends and non-friends to filter out existing users
    const newUserEmails = sharedUserEmails.filter(
        (email) =>
            ![...mappedExistingFriends, ...existingNonFriends]
                .map((u) => u.email)
                .includes(email)
    );

    // filter out any users that already have the list shared with them
    mappedExistingFriends = mappedExistingFriends.filter(
        (f) =>
            // account for users who were invited by email as well as existing users
            !existingSharedUsers.some(
                (u) => u.sharedUserId === f.id || u.sharedEmail === f.email
            )
    );

    // filter out any users that already have the list shared with them
    existingNonFriends = existingNonFriends.filter(
        (u) =>
            // account for users who were invited by email as well as existing users
            !existingSharedUsers.some(
                (eu) => eu.sharedUserId === u.id || eu.sharedEmail === u.email
            )
    );

    // END separate emails ------------------------------------------------------------------------------

    // send friend requests to existing users who aren't friends
    for (const user of existingNonFriends) {
        if (user.id !== userId) {
            // NOTE: this sends them an email
            await sendFriendRequest(userId, user.email);
        }
    }

    // send friend requests to net new users
    for (const email of newUserEmails) {
        await sendFriendRequest(userId, email);
    }

    // unshare any users, including any users that were invited by email
    await prisma.sharedList.deleteMany({
        where: {
            listId: list.id,
            OR: [
                { sharedUser: { email: { in: unsharedUserEmails } } },
                { sharedEmail: { in: unsharedUserEmails } },
            ],
        },
    });

    // create new shared list entries
    const newSharedUserIds = [
        ...mappedExistingFriends.map((f) => f.id),
        ...existingNonFriends.map((u) => u.id),
    ];
    await prisma.sharedList.createMany({
        data: newSharedUserIds.map((id) => ({
            listId: list.id,
            sharedUserId: id,
        })),
    });
    // add invited users by email so the list can be shared with them later
    await prisma.sharedList.createMany({
        data: newUserEmails.map((email) => ({
            listId: list.id,
            sharedEmail: email,
        })),
    });

    // send share email to existing friends ONLY (net new users and non-friends will get a friend request email)
    if (mappedExistingFriends.length > 0) {
        // NOTE: mappedExistingFriends has already been  filtered to only include users who don't already have the list shared with them
        await sendShareEmails(mappedExistingFriends, list.name, list.user.name);
    }
}

export async function deleteSharedList(
    listId: number,
    userId: number
): Promise<void> {
    // allow to find more than one here to clean up any extra relationships
    // that may have slipped through. This is a redundancy.
    await prisma.sharedList.deleteMany({
        where: { listId: listId, sharedUserId: userId },
    });
}

async function sendShareEmails(
    users: { email: string; name: string }[],
    listName: string,
    ownerName: string
) {
    const objects = users.map((user) => ({
        from: 'wishlist <donotreply@wishlist.mackentish.com>',
        to: [user.email],
        subject: 'A new list has been shared with you!',
        react: ShareTemplate({
            ownerName,
            userName: user.name,
            listName,
        }),
    }));
    const { error, data } = await resend.batch.send(objects);
    if (error) {
        console.error('Error sending emails', error);
    } else {
        console.log('Emails sent', data);
    }
}

/**
 * Removes the purchased items from a list. Optionally sends an email to the user with the removed items
 * @param listId The ID for the list to remove purchased items from
 * @param sendEmail Optionally, we can send an email to the user with the removed items
 * @param userEmail The email of the user to send the email to
 */
export async function deletePurchasedItems(
    listId: number,
    sendEmail: boolean,
    userEmail: string
): Promise<void> {
    // send email if requested
    if (sendEmail) {
        // get list name
        const list = await prisma.list.findUnique({ where: { id: listId } });
        if (list) {
            const items = await prisma.listItem.findMany({
                where: { listId: list.id, boughtBy: { isNot: null } },
                include: { boughtBy: true },
            });
            const itemsString = items.map(
                (i) => `${i.name} - ${i.boughtBy?.name}`
            );

            // send email
            const { error, data } = await resend.emails.send({
                from: 'wishlist <donotreply@wishlist.mackentish.com>',
                to: userEmail,
                subject: "You've removed purchased items from your list",
                react: PurchasedItemsTemplate({ items: itemsString }),
            });
            if (error) {
                console.error('Error sending email', error);
            } else {
                console.log('Email sent', data);
            }
        } else {
            throw new Error('List not found');
        }
    }

    // delete all items that have been bought
    await prisma.listItem.deleteMany({
        where: { listId: listId, boughtBy: { isNot: null } },
    });
}
