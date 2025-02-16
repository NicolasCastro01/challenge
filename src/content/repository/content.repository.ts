import { DataSource } from 'typeorm'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Content as ContentModel } from 'src/content/entity'
import { ContentModelToEntityAdapter } from '@/content/adapters/contentModelToEntity.adapter'
import { Content } from '@/content/core'
import { MetadataTypes } from '@/content/contracts/metadata'

@Injectable()
export class ContentRepository implements ContentRepository {
  private readonly logger = new Logger(ContentRepository.name)

  constructor(private readonly dataSource: DataSource) {}

  async findOne<Type extends MetadataTypes>(contentId: string): Promise<Content<Type>> {
    try {
      const [content] = await this.dataSource.query<ContentModel[]>(
        `SELECT * FROM contents WHERE id = '${contentId}' AND deleted_at IS NULL LIMIT 1`,
      )

      if (!content) {
        this.logger.warn(`Content not found for id=${contentId}`)
        throw new NotFoundException(`Content not found: ${contentId}`)
      }

      return ContentModelToEntityAdapter.adapt<Type>(content)
    } catch (error) {
      this.logger.error(`Database error while fetching content: ${error}`)
      throw new NotFoundException(`Database error: ${error}`)
    }
  }
}
