import { Provisioner } from '@/content/contracts'
import { MetadataTypes } from '@/content/contracts/metadata'
import { Content } from '@/content/core'
import {
  ImageProvisioner,
  LinkProvisioner,
  PDFProvisioner,
  TextProvisioner,
  VideoProvisioner,
} from '@/content/strategy'

import { BadRequestException, Logger } from '@nestjs/common'

export class ProvisionerFactory {
  private static readonly logger = new Logger(ProvisionerFactory.name)

  private constructor() {
    //
  }

  private static readonly strategyMap: Record<
    MetadataTypes,
    new (content: Content<MetadataTypes>) => Provisioner
  > = {
    pdf: PDFProvisioner,
    video: VideoProvisioner,
    image: ImageProvisioner,
    link: LinkProvisioner,
    text: TextProvisioner,
  }

  static getByContent<ContentType extends MetadataTypes>(
    content: Content<ContentType>,
  ): Provisioner {
    const contentId = content.getIdentity()
    const contentType = content.getType()

    const Strategy = this.strategyMap[contentType]

    if (!Strategy) {
      this.logger.warn(`Unsupported content type for ID=${contentId}, type=${contentType}`)
      throw new BadRequestException(`Unsupported content type: ${contentType}`)
    }

    return new Strategy(content)
  }
}
