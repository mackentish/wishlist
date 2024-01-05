import type { NextApiRequest, NextApiResponse } from "next";
import { deleteItemById, getSessionUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // find user
  const existingUser = await getSessionUser(req, res);
  if (!existingUser) {
    res.status(401).json({ error: "User not found, unauthorized" });
    return;
  }

  // delete list item
  const itemId = Number.parseInt(req.query.itemId as string);
  const success = await deleteItemById(itemId, existingUser.id);
  if (success) {
    res.status(204).json({ message: "Item deleted" });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
  return;
}
