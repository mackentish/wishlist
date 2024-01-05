import type { NextApiRequest, NextApiResponse } from "next";
import { toggleBought, getSessionUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // find user
  const existingUser = await getSessionUser(req, res);
  if (!existingUser) {
    res.status(401).json({ error: "User not found, unauthorized" });
    return;
  }

  // mark item as bought if it is shared with the user
  const itemId = Number.parseInt(req.query.itemId as string);
  const { isBought } = JSON.parse(req.body) as { isBought: boolean };
  if (typeof isBought !== "boolean") {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const success = await toggleBought(itemId, existingUser.id, isBought);
  if (success) {
    res.status(200).json({ message: "Item bought" });
  } else {
    res.status(404).json({ error: "Item not found or not shared with user" });
  }
  return;
}
