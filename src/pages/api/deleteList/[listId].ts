import { prisma } from "../_base";
import type { NextApiRequest, NextApiResponse } from "next";
import { List } from "@/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<List[]>
) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (req.method !== "DELETE") {
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

      // find user
      const existingUser = await prisma.user.findUnique({
        where: { email: session.user.email!! },
      });
      if (!existingUser) {
        res.status(404);
        reject();
        return;
      }

      // verify list exists for user
      const listId = Number.parseInt(req.query.listId as string);
      const list = await prisma.list.findUnique({
        where: { id: listId, userId: existingUser.id },
      });
      if (!list) {
        res.status(404);
        reject();
        return;
      }

      // delete list and it's items
      await prisma.listItem.deleteMany({ where: { listId: list.id } });
      await prisma.list.delete({ where: { id: list.id } });
      res.status(204);
      resolve();
      return;
    } catch {
      res.status(500);
      reject();
      return;
    }
  });
}
