import { MetadataTypes } from '@/content/contracts/metadata'
import { Content } from '@/content/core'
import { Content as ContentModel } from '@/content/entity'

export class ContentModelToEntityAdapter {
  static adapt<Type extends MetadataTypes>(contentModel: ContentModel): Content<Type> {
    return Content.restore<Type>(
      {
        title: contentModel.title,
        cover: contentModel.cover,
        description: contentModel.description,
        total_likes: contentModel.total_likes,
        type: contentModel.type as Type,
        url: contentModel.url,
        created_at: contentModel.created_at,
      },
      contentModel.id,
    )
  }
}
