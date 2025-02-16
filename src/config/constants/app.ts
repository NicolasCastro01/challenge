import { AppConfig } from '@/config/interfaces'

export const APP = {
  PORT: parseInt(process.env.PORT) || 3000,
} satisfies AppConfig
