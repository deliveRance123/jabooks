import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set in environment variables!');
}

// Neon HTTP serverless client (safe for Vercel edge/serverless functions, zero connection limit issues)
export const sql = neon(process.env.DATABASE_URL || '');
