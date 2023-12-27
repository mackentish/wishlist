import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { List } from "@/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

function mapLists(lists: any[]): List[] {
  return lists.map((list) => ({
    id: list.id,
    name: list.name,
    description: list.description ?? undefined,
    items:
      list.items?.map((item: any) => ({
        id: item.id,
        name: item.name,
        note: item.note ?? undefined,
        link: item.link,
        isBought: item.isBought,
      })) ?? [],
    userId: list.userId,
  }));
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<List[]>
) {
  return new Promise<void>(async (resolve, reject) => {
    const prisma = new PrismaClient();
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

      // find user
      const existingUser = await prisma.user.findUnique({
        where: { email: session.user.email!! },
      });
      if (!existingUser) {
        res.status(404);
        reject();
        return;
      }

      // find all lists associated with user
      // TODO: add shared lists once implemented
      const lists = await prisma.list.findMany({
        where: { userId: existingUser.id },
        include: { items: true },
      });

      res.status(200).send(mapLists(lists));
      resolve();
      return;
    } catch {
      res.status(500);
      reject();
      return;
    } finally {
      prisma.$disconnect();
    }
  });
}
