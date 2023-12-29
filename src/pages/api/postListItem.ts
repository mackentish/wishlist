import { prisma } from "./_base";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { CreateListItemRequest, List } from "@/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  return new Promise<void>(async (resolve, reject) => {
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

      // validate data
      const { listId, name, link, note, isBought } = JSON.parse(
        req.body
      ) as CreateListItemRequest;
      if (!listId || !name || !link || isBought === undefined) {
        res.status(400);
        reject();
        return;
      }

      // validate that list belongs to user
      const list = await prisma.list.findUnique({
        where: { id: listId, userId: user.id },
      });
      // if not, throw 401
      if (!list) {
        res.status(401);
        reject();
        return;
      }

      // create list item
      await prisma.listItem.create({
        data: {
          name,
          link,
          note: note ? note : undefined,
          isBought,
          list: { connect: { id: listId } },
        },
      });

      res.status(200).send();
      resolve();
      return;
    } catch (err) {
      res.status(500);
      reject();
      return;
    }
  });
}
