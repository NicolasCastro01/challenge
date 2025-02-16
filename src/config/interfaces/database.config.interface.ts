export interface DatabaseConfig {
  host: string
  port: number
  username: string
  password: string
  database: string
  auto_load_entities: boolean
  synchronize: boolean
}
