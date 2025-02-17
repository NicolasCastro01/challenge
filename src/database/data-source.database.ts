import { ENV } from '@/config/constants'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DATABASE.host,
  port: ENV.DATABASE.port,
  username: ENV.DATABASE.username,
  password: ENV.DATABASE.password,
  database: ENV.DATABASE.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migration/*{.ts,.js}'],
})
