import type { NextApiRequest, NextApiResponse } from "next";
import { deleteListById, getSessionUser } from "@/repo";

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

  // delete list
  const listId = Number.parseInt(req.query.listId as string);
  const success = await deleteListById(listId, existingUser.id);
  if (success) {
    res.send(204);
  } else {
    res.send(404);
  }
  return;
}
