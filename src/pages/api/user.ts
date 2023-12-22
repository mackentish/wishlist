import { UserResponseData } from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { mockUserResponse } from "@/__mocks__";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponseData>
) {
  // TODO: use next auth getServerSession
  if (req.method !== "GET") {
    res.status(405);
    return;
  }
  // TODO: get actual data from database
  setTimeout(() => {
    res.status(200).json(mockUserResponse);
  }, 1000);
}
