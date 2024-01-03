import type { NextApiRequest, NextApiResponse } from "next";
import { deleteItemById, getSessionUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.send(405);
    return;
  }

  // find user
  const existingUser = await getSessionUser(req, res);
  if (!existingUser) {
    res.send(404);
    return;
  }

  // delete list item
  const itemId = Number.parseInt(req.query.itemId as string);
  const success = await deleteItemById(itemId, existingUser.id);
  if (success) {
    res.send(204);
  } else {
    res.send(404);
  }
  return;
}
