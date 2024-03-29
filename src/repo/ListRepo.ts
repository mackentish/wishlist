import { InviteTemplate, ShareTemplate } from '@/email-templates';
import { CreateListRequest, List, ShareUser } from '@/types';
import { Resend } from 'resend';
import { prisma } from './_base';

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

export async function getListsForUser(userId: number): Promise<List[]> {
    // find all lists associated with user
    // first, get lists owned by user
    const userLists = await prisma.list.findMany({
        where: { userId: userId },
        include: {
            items: { include: { boughtBy: true } },
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

    // next, get lists shared with user
    const sharedLists = await prisma.sharedList.findMany({
        where: { sharedUserId: userId },
        select: {
            list: {
                include: {
                    items: { include: { boughtBy: true } },
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
    return [...newUserLists, ...newSharedLists];
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

// TODO: change this
async function sendInviteEmails(
    emails: string[],
    listName: string,
    ownerName: string
) {
    const objects = emails.map((email) => ({
        from: 'wishlist <donotreply@wishlist.mackentish.com>',
        to: email,
        subject: "You've been invited to wishlist!",
        react: InviteTemplate({
            ownerName,
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

export async function shareList(
    listId: number,
    sharedUserEmails: string[],
    unsharedUserEmails: string[],
    userId: number
): Promise<boolean> {
    // verify list exists for user
    const list = await prisma.list.findUnique({
        where: { id: listId, userId: userId },
        include: { user: { select: { name: true } } },
    });
    if (!list) {
        return false;
    }

    // find user ids for emails
    const sharedUsers = await prisma.user.findMany({
        where: { email: { in: sharedUserEmails } },
        select: { id: true, email: true, name: true },
    });
    const unsharedUsers = await prisma.user.findMany({
        where: { email: { in: unsharedUserEmails } },
        select: { id: true, email: true, name: true },
    });

    // find new users based on emails that don't exist in the database
    const newUsers = sharedUserEmails.filter(
        (email) => !sharedUsers.map((u) => u.email).includes(email)
    );

    // filter out any users that already have the list shared with them
    const existingSharedUsers = await prisma.sharedList.findMany({
        where: {
            listId: list.id,
            sharedUserId: { in: sharedUsers.map((u) => u.id) },
        },
        select: { sharedUserId: true },
    });
    const netNewSharedUsers = sharedUsers.filter(
        (u) => !existingSharedUsers.map((eu) => eu.sharedUserId).includes(u.id)
    );

    // unshare any users
    await prisma.sharedList.deleteMany({
        where: {
            listId: list.id,
            sharedUserId: { in: unsharedUsers.map((u) => u.id) },
        },
    });
    // including any users that were invited by email
    await prisma.sharedList.deleteMany({
        where: {
            listId: list.id,
            sharedEmail: { in: unsharedUserEmails },
        },
    });

    // create new shared list entries
    await prisma.sharedList.createMany({
        data: netNewSharedUsers.map((user) => ({
            listId: list.id,
            sharedUserId: user.id,
        })),
    });
    // add invited users by email so the list can be shared with them later
    await prisma.sharedList.createMany({
        data: newUsers.map((email) => ({
            listId: list.id,
            sharedEmail: email,
        })),
    });

    // send email to shared users
    await sendShareEmails(netNewSharedUsers, list.name, list.user.name);
    // invite new users by email
    await sendInviteEmails(newUsers, list.name, list.user.name);

    return true;
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
