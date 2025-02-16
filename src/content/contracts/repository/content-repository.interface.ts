import { MetadataTypes } from '@/content/contracts/metadata'
import { Content } from '@/content/core'

export interface ContentRepositoryContract {
  findOne<Type extends MetadataTypes>(contentId: string): Promise<Content<Type>>
}
