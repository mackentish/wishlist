import { CreateListRequest, List, SharedListResponse } from "@/types";
import { prisma } from "./_base";

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

  // delete list and it's items
  await prisma.listItem.deleteMany({ where: { listId: list.id } });
  await prisma.list.delete({ where: { id: list.id } });
  return true;
}

export async function getListsForUser(userId: number): Promise<List[]> {
  // find all lists associated with user
  // first, get lists owned by user
  const userLists = await prisma.list.findMany({
    where: { userId: userId },
    include: { items: true },
  });
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
  });

  // combine lists and return
  return [...userLists, ...sharedLists.map((sl) => sl.list)];
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

export async function updateListToShare(
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

  // update list so it is able to be shared for 24 hours
  await prisma.list.update({
    where: { id: list.id },
    data: {
      linkExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  return true;
}

export async function getSharedListData(
  listId: number
): Promise<SharedListResponse | null> {
  // find list
  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: {
      user: {
        select: { name: true },
      },
    },
  });
  if (!list) {
    return null;
  }

  // check if link has expired
  if (list.linkExpires && list.linkExpires < new Date()) {
    return null;
  }

  // return list data
  return {
    userName: list.user.name,
    listName: list.name,
    listDescription: list.description,
  };
}
