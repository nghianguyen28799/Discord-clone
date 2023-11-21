import { getAuth } from "@clerk/nextjs/server";
import React from "react";
import { db } from "./db";
import { NextApiRequest } from "next";

const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) return null;

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  return profile;
};

export default currentProfilePages;
