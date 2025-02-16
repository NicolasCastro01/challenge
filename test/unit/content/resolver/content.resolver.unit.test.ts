import { Test, TestingModule } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { ContentResolver } from 'src/content/resolver'
import { ContentService } from 'src/content/service'
import { ProvisionDto } from 'src/content/dto'
import { Logger, UnprocessableEntityException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthService } from 'src/user/service'
import { UserRepository } from 'src/user/repository'
import { ContentServiceContract as ContentServiceProvider } from '@/content/providers/service'

@suite
export class ContentResolverUnitTest {
  private contentResolver: ContentResolver
  private contentService: ContentService
  private readonly mockProvisionDto: ProvisionDto = {
    id: '4372ebd1-2ee8-4501-9ed5-549df46d0eb0',
    title: 'Sample Content',
    description: 'Test Description',
    url: 'http://localhost:3000/uploads/dummy.pdf',
    created_at: new Date('2025-01-31T23:39:54.236Z'),
    total_likes: 10,
    type: 'pdf',
    allow_download: true,
    is_embeddable: false,
    format: 'pdf',
    bytes: 1024,
    metadata: {},
  }

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentResolver,
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ContentServiceProvider,
          useValue: {
            provision: jest.fn(),
          },
        },
      ],
    }).compile()

    this.contentResolver = module.get<ContentResolver>(ContentResolver)
    this.contentService = module.get<ContentService>(ContentServiceProvider)
  }

  private createGqlExecutionContext(userId?: string): GqlExecutionContext {
    return {
      getContext: jest.fn().mockReturnValue({
        req: {
          user: { id: userId || 'default-user-id' },
        },
      }),
    } as unknown as GqlExecutionContext
  }

  @test
  async '[provision] Should return provisioned content for valid request'() {
    jest.spyOn(this.contentService, 'provision').mockResolvedValue(this.mockProvisionDto)

    const gqlContext = this.createGqlExecutionContext('valid-user-id')
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlContext)

    const result = await this.contentResolver.provision(
      '4372ebd1-2ee8-4501-9ed5-549df46d0eb0',
      gqlContext.getContext().req,
    )

    expect(result).toStrictEqual(this.mockProvisionDto)
    expect(this.contentService.provision).toHaveBeenCalledWith(
      '4372ebd1-2ee8-4501-9ed5-549df46d0eb0',
    )
  }

  @test
  async '[provision] Should log provisioning request'() {
    const loggerSpy = jest.spyOn(Logger.prototype, 'log')

    jest.spyOn(this.contentService, 'provision').mockResolvedValue(this.mockProvisionDto)

    const gqlContext = this.createGqlExecutionContext('valid-user-id')
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlContext)

    await this.contentResolver.provision(
      '4372ebd1-2ee8-4501-9ed5-549df46d0eb0',
      gqlContext.getContext().req,
    )

    expect(loggerSpy).toHaveBeenCalledWith(
      `Provisioning content=4372ebd1-2ee8-4501-9ed5-549df46d0eb0 to user=valid-user-id`,
    )
  }

  @test
  async '[provision] Should throw unprocessable entity exception if no content id'() {
    const loggerSpy = jest.spyOn(Logger.prototype, 'log')

    const gqlContext = this.createGqlExecutionContext('valid-user-id')
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlContext)

    try {
      await this.contentResolver.provision('', gqlContext.getContext().req)
      expect(loggerSpy).toHaveBeenCalledWith('Content ID is required')
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.message).toBe('Content ID is invalid')
    }
  }

  @test
  async '[provision] Should throw error if content service fails'() {
    jest.spyOn(this.contentService, 'provision').mockRejectedValue(new Error('Service failed'))

    const gqlContext = this.createGqlExecutionContext('valid-user-id')
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlContext)

    await expect(
      this.contentResolver.provision('invalid-content-id', gqlContext.getContext().req),
    ).rejects.toThrow('Service failed')
  }
}
