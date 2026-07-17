import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient across Next.js dev hot-reloads instead of
// opening a fresh connection pool on every module reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
