import { type Provisioner } from '@/content/contracts'
import { Metadata } from '@/content/contracts/metadata'
import { Content } from '@/content/core'
import { type ProvisionDto } from '@/content/dto'

export class TextProvisioner implements Provisioner {
  private readonly type: string
  private readonly format: string
  private readonly content: Content<'text'>

  public constructor(content: Content<'text'>) {
    this.content = content
    this.type = 'text'
    this.format = 'txt'
  }

  provision(): ProvisionDto {
    const bytes = this.content.getBytes()

    this.content.activateDownload()
    this.content.deactivateEmbed()

    const metadata: Metadata<'text'> = {
      size: bytes,
      creator: 'Unknown',
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
      bytes,
      metadata: this.content.getMetadata(),
    }
  }
}
