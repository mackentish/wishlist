import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "./_base";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { GetUserResponse, User } from "@/types";

export async function getSessionUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Omit<User, "lists"> | null> {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return null;
  }

  // find user
  const existingUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!existingUser) {
    return null;
  }
  return existingUser;
}

export async function findOrCreateUser(
  email: string,
  name: string
): Promise<GetUserResponse> {
  // find or create user
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { lists: { include: { items: true } } },
  });
  if (existingUser) {
    return existingUser;
  } else {
    // create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    // return it
    return newUser;
  }
}
