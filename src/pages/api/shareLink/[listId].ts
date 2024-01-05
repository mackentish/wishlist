import type { NextApiRequest, NextApiResponse } from "next";
import { getSessionUser, updateListToShare } from "@/repo";
import { getURL } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.send(405);
    return;
  }

  // find user
  const existingUser = await getSessionUser(req, res);
  if (!existingUser) {
    res.send(404);
    return;
  }

  // update list so it's able to be shared
  const listId = Number.parseInt(req.query.listId as string);
  const success = await updateListToShare(listId, existingUser.id);
  if (success) {
    res.status(200).send({ link: getURL(`/shared-list/${listId}`) });
  } else {
    res.send(400);
  }
  return;
}
