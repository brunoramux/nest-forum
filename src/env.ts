import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333), // coerce tranforma em número pois o dados entra no zod sempre como string
})

export type Env = z.infer<typeof envSchema>
