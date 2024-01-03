import type { NextApiRequest, NextApiResponse } from "next";
import { CreateListItemRequest } from "@/types";
import { createItem, getSessionUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.send(405);
    return;
  }

  const existingUser = await getSessionUser(req, res);
  if (!existingUser) {
    res.send(401);
    return;
  }

  // validate data
  const data = JSON.parse(req.body) as CreateListItemRequest;
  if (!data.listId || !data.name || !data.link || data.isBought === undefined) {
    res.send(400);
    return;
  }

  const success = await createItem(data, existingUser.id);
  if (success) {
    res.send(204);
  } else {
    res.send(401);
  }
  return;
}
