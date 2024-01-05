import type { NextApiRequest, NextApiResponse } from "next";
import { GetUserResponse } from "@/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { findOrCreateUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUserResponse | { message: string }>
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

  const user = await findOrCreateUser(session.user.email, session.user.name);
  res.status(200).json(user);

  return;
}
