import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserResponseData } from "@/types/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

function mapUser(user: any): UserResponseData {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    lists:
      user.lists?.map((list: any) => ({
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
      })) ?? [],
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponseData>
) {
  return new Promise<void>(async (resolve, reject) => {
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
    const prisma = new PrismaClient();
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email!! },
      include: { lists: { include: { items: true } } },
    });
    if (existingUser) {
      res.status(200).send(mapUser(existingUser));
    } else {
      // create user
      const newUser = await prisma.user.create({
        data: {
          email: session.user.email!!,
          name: session.user.name!!,
        },
      });
      // return it
      res.status(201).send(mapUser(newUser));
    }

    resolve();
    return;
  });
}