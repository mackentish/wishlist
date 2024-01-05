import type { NextApiRequest, NextApiResponse } from "next";
import { SharedListResponse } from "@/types";
import { getSharedListData, getSessionUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SharedListResponse | { message: string }>
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

  const listId = Number.parseInt(req.query.listId as string);
  const listData = await getSharedListData(listId);
  if (listData) {
    res.status(200).json(listData);
  } else {
    res.status(404).json({ message: "List not found" });
  }
  return;
}
