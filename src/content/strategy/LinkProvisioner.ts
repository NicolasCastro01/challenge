import { type Provisioner } from '@/content/contracts'
import { Metadata } from '@/content/contracts/metadata'
import { Content } from '@/content/core'
import { type ProvisionDto } from '@/content/dto'
import { LinkHelper } from '@/content/helper/LinkHelper'

export class LinkProvisioner implements Provisioner {
  private readonly type: string
  private readonly format: string
  private readonly content: Content<'link'>

  public constructor(content: Content<'link'>) {
    this.content = content
    this.type = 'link'
    this.format = 'pdf'
  }

  provision(): ProvisionDto {
    this.content.deactivateDownload()
    this.content.activateEmbed()

    const metadata: Metadata<'link'> = {
      trusted: LinkHelper.checkTrustByUrl(this.content.getUrl()),
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
      url: this.content.getUrl() || 'http://default.com',
      allow_download: this.content.getAllowDownload(),
      is_embeddable: this.content.getIsEmbeddable(),
      format: this.content.getFormat(),
      bytes: this.content.getBytes(),
      metadata: this.content.getMetadata(),
    }
  }
}
