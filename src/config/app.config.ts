import { type AppConfig } from '@/config/interfaces'
import { registerAs } from '@nestjs/config'
import { ENV } from '@/config/constants'

export default registerAs<AppConfig>('app', () => ({
  PORT: ENV.APP.PORT,
}))
