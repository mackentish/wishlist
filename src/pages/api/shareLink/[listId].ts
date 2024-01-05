import type { NextApiRequest, NextApiResponse } from "next";
import { getSessionUser, updateListToShare } from "@/repo";
import { getURL } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ link: string } | { message: string }>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // find user
  const existingUser = await getSessionUser(req, res);
  if (!existingUser) {
    res.status(401).json({ message: "No user found, unauthorized." });
    return;
  }

  // update list so it's able to be shared
  const listId = Number.parseInt(req.query.listId as string);
  const success = await updateListToShare(listId, existingUser.id);
  if (success) {
    res.status(200).json({ link: getURL(`/shared-list/${listId}`) });
  } else {
    res.status(404).json({ message: "List not found for user" });
  }
  return;
}
