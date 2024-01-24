import type { NextApiRequest, NextApiResponse } from "next";
import { ShareUser } from "@/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getShareableUsers } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShareUser[] | { message: string }>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email || !session?.user?.name) {
    res.status(400).json({ message: "Invalid session" });
    return;
  }

  const shareableUsers = await getShareableUsers(session.user.email);
  res.status(200).json(shareableUsers);

  return;
}