import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      CLOUDFLARE_API_TOKEN: string;
      CLOUDFLARE_ACCOUNT_ID: string;
      D1_ENDPOINT: string | undefined;
      D1_DATABASE_ID: string;
    }
  }
}

// Regular Prisma client with D1 adapter for non-edge environments
export const prisma = globalThis.prisma ?? new PrismaClient();


if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
} 
