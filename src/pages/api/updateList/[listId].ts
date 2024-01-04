import type { NextApiRequest, NextApiResponse } from "next";
import { updateListById, getSessionUser } from "@/repo";
import { CreateListRequest } from "@/types";

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
  const data = JSON.parse(req.body) as CreateListRequest;
  if (!data.name) {
    res.send(400);
    return;
  }

  // delete list
  const listId = Number.parseInt(req.query.listId as string);
  const success = await updateListById(listId, data, existingUser.id);
  if (success) {
    res.send(200);
  } else {
    res.send(404);
  }
  return;
}
