import type { NextApiRequest, NextApiResponse } from "next";
import { deleteSharedList, getSessionUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const existingUser = await getSessionUser(req, res);
  // if no user, return unauthorized
  if (!existingUser) {
    res.status(401).json({ error: "No user found, unauthorized." });
    return;
  }

  // validate data
  const data = JSON.parse(req.body) as { listId: number };
  if (!data.listId) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }

  await deleteSharedList(data.listId, existingUser.id);

  res.status(200).json({ message: "List created" });
  return;
}
