import { UserResponseData } from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { mockUserResponse } from "@/__mocks__";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponseData>
) {
  return new Promise<void>((resolve, reject) => {
    // TODO: use next auth getServerSession
    if (req.method !== "GET") {
      res.status(405);
      reject();
    }
    // TODO: get actual data from database
    setTimeout(() => {
      res.status(200).send(mockUserResponse);
      resolve();
    }, 1000);
  });
}
