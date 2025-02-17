import { DatabaseConfig } from '@/config/interfaces'

export const DATABASE = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  auto_load_entities: true,
  synchronize: false,
} satisfies DatabaseConfig
