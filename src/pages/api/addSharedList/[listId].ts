import type { NextApiRequest, NextApiResponse } from "next";
import { addSharedList, getSessionUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "method not allowed" });
    return;
  }

  // find user
  const existingUser = await getSessionUser(req, res);
  if (!existingUser) {
    res.status(404).json({ message: "user not found" });
    return;
  }

  // add shared list
  const listId = Number.parseInt(req.query.listId as string);
  const success = await addSharedList(listId, existingUser.id);
  if (success) {
    res.status(200).json({ message: "success" });
  } else {
    res.status(404).json({ message: "unable to add list to user" });
  }
  return;
}
