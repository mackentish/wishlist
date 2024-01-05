import type { NextApiRequest, NextApiResponse } from "next";
import { SharedListResponse } from "@/types";
import { getSharedListData, getSessionUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SharedListResponse>
) {
  if (req.method !== "GET") {
    res.status(405).send({} as SharedListResponse);
    return;
  }

  // find user
  const existingUser = await getSessionUser(req, res);
  if (!existingUser) {
    res.status(404).send({} as SharedListResponse);
    return;
  }

  const listId = Number.parseInt(req.query.listId as string);
  const listData = await getSharedListData(listId);
  if (listData) {
    res.status(200).send(listData);
  } else {
    res.status(404).send({} as SharedListResponse);
  }
  return;
}
