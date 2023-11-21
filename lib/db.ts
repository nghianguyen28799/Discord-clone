import { PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
