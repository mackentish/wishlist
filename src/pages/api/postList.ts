import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { CreateListRequest } from "@/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  return new Promise<void>(async (resolve, reject) => {
    const prisma = new PrismaClient();
    try {
      if (req.method !== "POST") {
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
      const user = await prisma.user.findUnique({
        where: { email: session.user.email!! },
      });
      if (!user) {
        res.status(404);
        reject();
        return;
      }

      console.log(req.body);
      // validate data
      const { name, description } = req.body as CreateListRequest;
      if (!name) {
        res.status(400);
        reject();
        return;
      }

      // create list
      await prisma.list.create({
        data: {
          name,
          description,
          user: { connect: { id: user.id } },
        },
      });

      resolve();
      return;
    } catch {
      res.status(500);
      reject();
      return;
    } finally {
      await prisma.$disconnect();
    }
  });
}
