import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'homol', 'prod']).default('dev'),
  APP_PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
