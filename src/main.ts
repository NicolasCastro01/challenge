import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { type AppConfig } from '@/config/interfaces'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const { PORT } = config.get<AppConfig>('app')

  app.use('/uploads', express.static(join(__dirname, '..', 'static')))

  await app.listen(PORT)
}
bootstrap()
