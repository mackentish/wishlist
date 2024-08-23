import {
    AcceptedRequestTemplate,
    FriendInviteTemplate,
} from '@/email-templates';
import { Friend, FriendRequest } from '@/types';
import { Resend } from 'resend';
import { prisma } from './_base';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getFriends(userId: number): Promise<Friend[]> {
    // get user friends
    const friends = await prisma.friend.findMany({
        where: { userId },
        select: { friend: { select: { id: true, name: true, email: true } } },
    });

    // get friendsOf user
    const friendsOf = await prisma.friend.findMany({
        where: { friendId: userId },
        select: { user: { select: { id: true, name: true, email: true } } },
    });

    return [...friends.map((f) => f.friend), ...friendsOf.map((f) => f.user)];
}

/**
 * Get pending friend requests sent to the given user.
 * @param userId The user the friend request is for
 */
export async function getFriendRequests(
    userId: number
): Promise<FriendRequest[]> {
    const friendRequests = await prisma.friendRequest.findMany({
        where: { receiverId: userId, status: 'PENDING' },
        select: {
            id: true,
            sender: { select: { id: true, name: true, email: true } },
        },
    });

    return friendRequests.map((request) => ({
        id: request.id,
        name: request.sender.name,
        email: request.sender.email,
    }));
}

/**
 * Send a friend request to the given email
 * @param userId The user sending the friend request
 * @param email The email of the user to send the friend request to
 */
export async function sendFriendRequest(userId: number, email: string) {
    // check if friend request already exists
    const existingRequest = await prisma.friendRequest.findFirst({
        where: {
            senderId: userId,
            email,
        },
    });
    // if request already exists, return
    if (existingRequest) {
        return;
    }

    // find sender by id
    const sender = await prisma.user.findFirst({ where: { id: userId } });
    if (!sender) {
        throw new Error('Sender not found');
    }

    // find receiver by email
    const receiver = await prisma.user.findFirst({ where: { email } });
    // if user not found, invite to join
    if (!receiver) {
        sendInviteEmail(email, sender.name);
    }

    // create the friend request (default status is PENDING)
    await prisma.friendRequest.create({
        data: {
            email,
            senderId: userId,
            receiverId: receiver ? receiver.id : null,
        },
    });
}

/**
 * Either accept or reject a friend request
 * @param userId The user updating the friend request
 * @param requestId The id of the friend request
 * @param accept Whether to accept or reject the friend request
 */
export async function updateFriendRequest(
    userId: number,
    requestId: number,
    accept: boolean
) {
    const request = await prisma.friendRequest.findFirst({
        where: { id: requestId },
        include: { sender: true },
    });

    if (!request) {
        throw new Error('Friend request not found');
    }

    await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: accept ? 'ACCEPTED' : 'REJECTED' },
    });

    // update friends table if accepted - setting the user as the person who sent the request
    if (accept) {
        await Promise.all([
            prisma.friend.create({
                data: {
                    friendId: userId,
                    userId: request.senderId,
                },
            }),
            sendAcceptedEmail(request.sender.email, request.sender.name),
        ]);
    }
}

async function sendInviteEmail(email: string, senderName: string) {
    const { error, data } = await resend.emails.send({
        from: 'wishlist <donotreply@wishlist.mackentish.com>',
        to: email,
        subject: "You've been invited to wishlist!",
        react: FriendInviteTemplate({ senderName }),
    });
    if (error) {
        console.error('Error sending email', error);
    } else {
        console.log('Email sent', data);
    }
}

async function sendAcceptedEmail(email: string, friendName: string) {
    const { error, data } = await resend.emails.send({
        from: 'wishlist <donotreply@wishlist.mackentish.com>',
        to: email,
        subject: `${friendName} accepted your friend request!`,
        react: AcceptedRequestTemplate({ friendName }),
    });
    if (error) {
        console.error('Error sending email', error);
    } else {
        console.log('Email sent', data);
    }
}
