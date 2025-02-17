import { type DatabaseConfig } from '@/config/interfaces'
import { registerAs } from '@nestjs/config'
import { ENV } from '@/config/constants'

export default registerAs<DatabaseConfig>('database', () => ({
  host: ENV.DATABASE.host,
  port: ENV.DATABASE.port,
  username: ENV.DATABASE.username,
  password: ENV.DATABASE.password,
  database: ENV.DATABASE.database,
  auto_load_entities: true,
  synchronize: false,
}))
