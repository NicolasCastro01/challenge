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
    this.format = null
  }

  provision(): ProvisionDto {
    this.content.deactivateDownload()
    this.content.activateEmbed()

    const metadata: Metadata<'link'> = {
      trusted: LinkHelper.checkTrustByUrl(this.content.getUrl()),
    }
    this.content.setMetadata(metadata)
    this.content.setFormat(this.format)

    const link = this.handleLink()

    return {
      id: this.content.getIdentity(),
      title: this.content.getTitle(),
      cover: this.content.getCover(),
      created_at: this.content.getCreatedAt(),
      description: this.content.getDescription(),
      total_likes: this.content.getTotalLikes(),
      type: this.type,
      url: link,
      allow_download: this.content.getAllowDownload(),
      is_embeddable: this.content.getIsEmbeddable(),
      format: this.content.getFormat(),
      bytes: this.content.getBytes(),
      metadata: this.content.getMetadata(),
    }
  }

  private handleLink(): string {
    if (this.content.hasNotProtocol()) return 'http://default.com'

    this.content.setLink()

    return this.content.getUrl()
  }
}
