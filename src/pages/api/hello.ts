import { HelloResponseData } from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HelloResponseData>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  res.status(200).json({ message: "Hello from Next.js!" });
}
