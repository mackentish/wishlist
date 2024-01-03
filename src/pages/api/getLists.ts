import type { NextApiRequest, NextApiResponse } from "next";
import { List } from "@/types";
import { getListsForUser, getSessionUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<List[]>
) {
  if (req.method !== "GET") {
    res.status(405).send([]);
    return;
  }

  // find user
  const existingUser = await getSessionUser(req, res);
  if (!existingUser) {
    res.status(404).send([]);
    return;
  }

  const lists = await getListsForUser(existingUser.id);
  res.status(200).send(lists);
  return;
}
