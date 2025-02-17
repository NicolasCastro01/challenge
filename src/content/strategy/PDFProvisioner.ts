import { type Provisioner } from '@/content/contracts'
import { Metadata } from '@/content/contracts/metadata'
import { Content } from '@/content/core'
import { type ProvisionDto } from '@/content/dto'
import { PDFHelper } from '@/content/helper/PDFHelper'

export class PDFProvisioner implements Provisioner {
  private readonly type: string
  private readonly format: string
  private readonly content: Content<'pdf'>

  public constructor(content: Content<'pdf'>) {
    this.content = content
    this.type = 'pdf'
    this.format = 'pdf'
  }

  provision(): ProvisionDto {
    const bytes = this.content.getBytes()

    this.content.activateDownload()
    this.content.deactivateEmbed()

    const metadata: Metadata<'pdf'> = {
      author: 'Unknown',
      pages: PDFHelper.countPagesFromBytes(bytes),
      encrypted: false,
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
