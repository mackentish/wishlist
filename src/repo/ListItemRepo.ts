import { CreateListItemRequest } from "@/types";
import { prisma } from "./_base";

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
      isBought: data.isBought,
      list: { connect: { id: data.listId } },
    },
  });
  return true;
}
