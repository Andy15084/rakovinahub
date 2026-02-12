import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use Prisma Accelerate URL if available, otherwise use direct PostgreSQL connection
const prismaAccelerateUrl = process.env.PRISMA_DATABASE_URL;
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// For Prisma Accelerate, set DATABASE_URL to the accelerate URL
// Prisma will automatically detect prisma+postgres:// URLs
if (prismaAccelerateUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = prismaAccelerateUrl;
}

const connectionUrl = prismaAccelerateUrl || databaseUrl;

export const prisma =
  global.prisma ??
  (connectionUrl && !prismaAccelerateUrl
    ? // Direct PostgreSQL connection with adapter
      new PrismaClient({
        adapter: new PrismaPg(new Pool({ connectionString: connectionUrl })),
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      })
    : // Prisma Accelerate - use accelerateUrl in constructor
      new PrismaClient({
        accelerateUrl: prismaAccelerateUrl || undefined,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      } as any));

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

