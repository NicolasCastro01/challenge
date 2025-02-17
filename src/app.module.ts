import { ApolloDriver } from '@nestjs/apollo'
import { CompanyModule } from '@/company'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ContentModule } from '@/content'
import { GraphQLError } from 'graphql'
import { GraphQLModule } from '@nestjs/graphql'
import { HttpStatus, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '@/user'
import AppConfig from '@/config/app.config'
import DatabaseConfig from '@/config/database.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig, DatabaseConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: config.get<boolean>('database.auto_load_entities'),
        synchronize: config.get<boolean>('database.synchronize'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      driver: ApolloDriver,
      introspection: true,
      playground: true,
      formatError: (error: GraphQLError) => {
        return {
          message: error.extensions?.originalError?.['message'],
          status_code:
            Number(error.extensions?.originalError?.['statusCode']) ||
            Number(error?.extensions?.code) ||
            HttpStatus.BAD_REQUEST,
          details: error?.extensions?.exception?.['details'] || error.extensions?.details,
        }
      },
    }),
    ContentModule,
    UserModule,
    CompanyModule,
  ],
})
export class AppModule {}
