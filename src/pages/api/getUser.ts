import type { NextApiRequest, NextApiResponse } from "next";
import { GetUserResponse } from "@/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { findOrCreateUser } from "@/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUserResponse>
) {
  if (req.method !== "GET") {
    res.status(405).send({} as GetUserResponse);
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email || !session?.user?.name) {
    res.status(400).send({} as GetUserResponse);
    return;
  }

  const user = await findOrCreateUser(session.user.email, session.user.name);
  res.status(200).send(user);

  return;
}
