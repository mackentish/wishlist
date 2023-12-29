import { prisma } from "./_base";
import type { NextApiRequest, NextApiResponse } from "next";
import { GetUserResponse } from "@/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUserResponse>
) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (req.method !== "GET") {
        res.status(405);
        reject();
        return;
      }

      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user) {
        res.status(404);
        reject();
        return;
      }

      // find or create user
      const existingUser = await prisma.user.findUnique({
        where: { email: session.user.email!! },
        include: { lists: { include: { items: true } } },
      });
      if (existingUser) {
        res.status(200).send(existingUser);
      } else {
        // create user
        const newUser = await prisma.user.create({
          data: {
            email: session.user.email!!,
            name: session.user.name!!,
          },
        });
        // return it
        res.status(201).send(newUser);
      }

      resolve();
      return;
    } catch {
      res.status(500);
      reject();
      return;
    }
  });
}
