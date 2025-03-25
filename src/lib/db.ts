import { PrismaClient } from '@prisma/client';

// Define globalThis with prisma property
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Only store in global in development to prevent memory leaks in production
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Helper function to safely execute Prisma operations with error handling
export async function prismaExec<T>(
  operation: () => Promise<T>,
  errorMsg: string = 'Database operation failed'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMsg}:`, error);
    throw new Error(errorMsg);
  }
}

export default prisma; 