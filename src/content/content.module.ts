import { Content } from '@/content/entity'
import { ContentRepository } from '@/content/repository'
import { ContentRepository as ContentRepositoryProvider } from '@/content/providers/repository'
import { ContentResolver } from '@/content/resolver'
import { ContentService } from '@/content/service'
import { ContentServiceContract as ContentServiceProvider } from '@/content/providers/service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '@/user'

@Module({
  imports: [TypeOrmModule.forFeature([Content]), UserModule],
  providers: [
    {
      provide: ContentServiceProvider,
      useClass: ContentService,
    },
    {
      provide: ContentRepositoryProvider,
      useClass: ContentRepository,
    },
    ContentResolver,
  ],
})
export class ContentModule {}
