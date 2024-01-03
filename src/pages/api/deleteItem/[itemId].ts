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

      // verify listItem exists for user
      const itemId = Number.parseInt(req.query.itemId as string);
      const item = await prisma.listItem.findUnique({
        where: { id: itemId },
      });
      // verify user owns list item
      const list = await prisma.list.findUnique({
        where: { id: item?.listId, userId: existingUser.id },
      });
      if (!item || !list) {
        res.status(404);
        reject();
        return;
      }

      // delete list item
      await prisma.listItem.delete({ where: { id: item.id } });
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
