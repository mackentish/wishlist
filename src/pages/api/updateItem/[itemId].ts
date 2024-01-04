import type { NextApiRequest, NextApiResponse } from "next";
import { updateItemById, getSessionUser } from "@/repo";
import { CreateListItemRequest } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.send(405);
    return;
  }

  // find user
  const existingUser = await getSessionUser(req, res);
  if (!existingUser) {
    res.send(404);
    return;
  }

  // validate data
  const data = JSON.parse(req.body) as CreateListItemRequest;
  if (!data.listId || !data.name || !data.link || data.isBought === undefined) {
    res.send(400);
    return;
  }

  // delete list item
  const itemId = Number.parseInt(req.query.itemId as string);
  const success = await updateItemById(itemId, data, existingUser.id);
  if (success) {
    res.send(200);
  } else {
    res.send(404);
  }
  return;
}
