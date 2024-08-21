import { prisma } from './_base';

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
        where: { id: requestId, receiverId: userId },
    });

    if (!request) {
        throw new Error('Friend request not found');
    }

    await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: accept ? 'ACCEPTED' : 'REJECTED' },
    });

    await prisma.friend.create({
        data: {
            userId,
            friendId: request.senderId,
        },
    });
}
