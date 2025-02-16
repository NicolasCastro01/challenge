import { Inject, Logger, UnprocessableEntityException, UseGuards } from '@nestjs/common'
import { Resolver, Args, Context, Query } from '@nestjs/graphql'
import { ProvisionDto } from '@/content/dto'
import { AuthGuard } from '@/user/guard'
import { ContentServiceContract as ContentServiceProvider } from '@/content/providers/service'
import { ContentServiceContract } from '@/content/contracts/service'

@Resolver()
export class ContentResolver {
  private readonly logger = new Logger(ContentResolver.name)

  constructor(
    @Inject(ContentServiceProvider)
    private readonly contentService: ContentServiceContract,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => ProvisionDto)
  provision(@Args('content_id') contentId: string, @Context('req') req): Promise<ProvisionDto> {
    if (!contentId) {
      this.logger.error(`Invalid Content ID: ${contentId}`)
      throw new UnprocessableEntityException(`Content ID is invalid: ${contentId}`)
    }

    this.logger.log(`Provisioning content=${contentId} to user=${req.user.id}`)
    return this.contentService.provision(contentId)
  }
}
