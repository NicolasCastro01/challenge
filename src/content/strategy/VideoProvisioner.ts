import { type Provisioner } from '@/content/contracts'
import { type Metadata } from '@/content/contracts/metadata'
import { Content } from '@/content/core'
import { type ProvisionDto } from '@/content/dto'
import { VideoHelper } from '@/content/helper/VideoHelper'

export class VideoProvisioner implements Provisioner {
  private readonly type: string
  private readonly content: Content<'video'>

  public constructor(content: Content<'video'>) {
    this.content = content
    this.type = 'video'
  }

  provision(): ProvisionDto {
    this.content.deactivateDownload()
    this.content.activateEmbed()

    const bytes = this.content.getBytes()
    const format = VideoHelper.getFormatFromExtension(this.content.getUrl())
    this.content.setFormat(format)

    const metadata: Metadata<'video'> = {
      duration: VideoHelper.getDurationFromBytes(bytes),
      resolution: '1080p',
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
      format: this.content.getFormat(),
      bytes,
      metadata: this.content.getMetadata(),
    }
  }
}
