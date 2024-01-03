import type { NextApiRequest, NextApiResponse } from "next";
import { CreateListRequest } from "@/types";
import { createList, getSessionUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.send(405);
    return;
  }

  const existingUser = await getSessionUser(req, res);
  // if no user, return unauthorized
  if (!existingUser) {
    res.send(401);
    return;
  }

  // validate data
  const data = JSON.parse(req.body) as CreateListRequest;
  if (!data.name) {
    res.send(400);
    return;
  }

  await createList(data, existingUser.id);

  res.send(200);
  return;
}
