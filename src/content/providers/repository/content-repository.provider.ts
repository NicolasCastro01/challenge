import { MetadataTypes } from '@/content/contracts/metadata'
import { Content } from '@/content/core'

interface ContentRepository {
  findOne<Type extends MetadataTypes>(contentId: string): Promise<Content<Type>>
}

export const ContentRepository = Symbol('ContentRepository')
