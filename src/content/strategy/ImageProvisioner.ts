import { type Provisioner } from '@/content/contracts'
import { Metadata } from '@/content/contracts/metadata'
import { Content } from '@/content/core'
import { type ProvisionDto } from '@/content/dto'
import { ImageHelper } from '@/content/helper'

export class ImageProvisioner implements Provisioner {
  private readonly type: string
  private readonly format: string
  private readonly content: Content<'image'>

  public constructor(content: Content<'image'>) {
    this.content = content
    this.type = 'image'
    this.format = ImageHelper.getFormatFromUrl(this.content.getURLRaw())
  }

  provision(): ProvisionDto {
    this.content.activateDownload()
    this.content.activateEmbed()

    const metadata: Metadata<'image'> = {
      resolution: '1920x1080',
      aspect_ratio: '16:9',
    }
    this.content.setMetadata(metadata)

    return {
      id: this.content.getIdentity(),
      title: this.content.getTitle(),
      cover: this.content.getCover(),
      created_at: this.content.getCreatedAt(),
      description: this.content.getDescription(),
      total_likes: this.content.getTotalLikes(),
      type: this.type,
      url: this.content.getUrl(),
      allow_download: this.content.getAllowDownload(),
      is_embeddable: this.content.getIsEmbeddable(),
      format: this.format,
      bytes: this.content.getBytes(),
      metadata: this.content.getMetadata(),
    }
  }
}
