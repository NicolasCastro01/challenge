import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { ProvisionDto } from 'src/content/dto'
import { ProvisionerFactory } from '@/content/factory'
import { ContentRepository } from '@/content/providers/repository'
import { ContentRepositoryContract } from '@/content/contracts/repository'
import { ContentServiceContract } from '@/content/contracts/service'

@Injectable()
export class ContentService implements ContentServiceContract {
  private readonly logger = new Logger(ContentService.name)

  constructor(
    @Inject(ContentRepository)
    private readonly contentRepository: ContentRepositoryContract,
  ) {}

  async provision(contentId: string): Promise<ProvisionDto> {
    this.logger.log(`Provisioning content for id=${contentId}`)
    const content = await this.contentRepository.findOne(contentId)

    if (!content.getType()) {
      this.logger.warn(`Missing content type for ID=${contentId}`)
      throw new BadRequestException('Content type is missing')
    }

    const provisioner = ProvisionerFactory.getByContent(content)
    const provisionedContent = provisioner.provision()

    return provisionedContent
  }
}
