import { NextApiResponseServerIo } from "@/types";
import { NextRequest } from "next/server";

export default async function handler(
  req: NextRequest,
  res: NextApiResponseServerIo
) {
    console.log("12321");
    
  return res.status(200).send("OK");
}
