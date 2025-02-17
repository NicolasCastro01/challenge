import { BadRequestException } from '@nestjs/common'
import { Content } from '@/content/core'
import { Content as ContentModel } from 'src/content/entity'
import { ContentModelToEntityAdapter } from '@/content/adapters/contentModelToEntity.adapter'
import { ContentRepository as ContentRepositoryProvider } from '@/content/providers/repository'
import { ContentRepositoryContract } from '@/content/contracts/repository'
import { ContentService } from 'src/content/service'
import { ContentServiceContract as ContentServiceProvider } from '@/content/providers/service'
import { suite, test } from '@testdeck/jest'
import { Test, TestingModule } from '@nestjs/testing'
import * as fs from 'fs'

@suite
export class ContentServiceUnitTest {
  private contentService: ContentService
  private contentRepository: ContentRepositoryContract

  private readonly mockContent = (type: string, format?: string, url?: string): ContentModel =>
    ({
      id: '4372ebd1-2ee8-4501-9ed5-549df46d0eb0',
      title: `Test ${type}`,
      description: `Description for ${type}`,
      url: url || `http://localhost:3000/uploads/dummy.${format}`,
      created_at: new Date('2025-01-31T23:39:54.236Z'),
      total_likes: 10,
      type,
    }) as ContentModel
  private mockContentEntity: Content<'pdf'> = ContentModelToEntityAdapter.adapt(
    this.mockContent('pdf'),
  )

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ContentServiceProvider,
          useClass: ContentService,
        },
        {
          provide: ContentRepositoryProvider,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    this.contentService = module.get<ContentService>(ContentServiceProvider)
    this.contentRepository = module.get<ContentRepositoryContract>(ContentRepositoryProvider)

    jest.clearAllMocks()
  }

  @test
  async '[provision] Should return provisioned PDF content'() {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 50000 } as fs.Stats)

    this.mockContentEntity.setUrl('http://localhost:3000/uploads/pdf2.pdf')
    jest.spyOn(this.contentRepository, 'findOne').mockResolvedValue(this.mockContentEntity)

    const result = await this.contentService.provision('4372ebd1-2ee8-4501-9ed5-549df46d0eb0')

    expect(result).toMatchObject({
      type: 'pdf',
      allow_download: true,
      is_embeddable: false,
      format: 'pdf',
      bytes: 50000,
      metadata: { author: 'Unknown', pages: 1, encrypted: false },
    })
  }

  @test
  async '[provision] Should return provisioned Image content'() {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 20000 } as fs.Stats)

    this.mockContentEntity.setUrl('http://localhost:3000/uploads/image2.png')
    this.mockContentEntity.setType('image')
    this.mockContentEntity.setFormat('png')

    jest.spyOn(this.contentRepository, 'findOne').mockResolvedValue(this.mockContentEntity)

    const result = await this.contentService.provision('4372ebd1-2ee8-4501-9ed5-549df46d0eb0')

    expect(result).toMatchObject({
      type: 'image',
      allow_download: true,
      is_embeddable: true,
      format: 'png',
      bytes: 20000,
      metadata: { resolution: '1920x1080', aspect_ratio: '16:9' },
    })
  }

  @test
  async '[provision] Should return provisioned Image content with default format'() {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 20000 } as fs.Stats)

    this.mockContentEntity.setUrl('http://localhost:3000/uploads/image1')
    this.mockContentEntity.setType('image')

    jest.spyOn(this.contentRepository, 'findOne').mockResolvedValue(this.mockContentEntity)

    const result = await this.contentService.provision('4372ebd1-2ee8-4501-9ed5-549df46d0eb0')

    expect(result).toMatchObject({
      type: 'image',
      allow_download: true,
      is_embeddable: true,
      format: 'jpg',
      bytes: 20000,
      metadata: { resolution: '1920x1080', aspect_ratio: '16:9' },
    })
  }

  @test
  async '[provision] Should return provisioned Video content'() {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 1000000 } as fs.Stats)

    this.mockContentEntity.setUrl('http://localhost:3000/uploads/video1.avi')
    this.mockContentEntity.setType('video')
    this.mockContentEntity.setFormat('avi')

    jest.spyOn(this.contentRepository, 'findOne').mockResolvedValue(this.mockContentEntity)

    const result = await this.contentService.provision('4372ebd1-2ee8-4501-9ed5-549df46d0eb0')

    expect(result).toMatchObject({
      type: 'video',
      allow_download: false,
      is_embeddable: true,
      format: 'avi',
      bytes: 1000000,
      metadata: { duration: 10, resolution: '1080p' },
    })
  }

  @test
  async '[provision] Should return provisioned Video content with default format'() {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 1000000 } as fs.Stats)

    this.mockContentEntity.setUrl('http://localhost:3000/uploads/video2')
    this.mockContentEntity.setType('video')

    jest.spyOn(this.contentRepository, 'findOne').mockResolvedValue(this.mockContentEntity)

    const result = await this.contentService.provision('4372ebd1-2ee8-4501-9ed5-549df46d0eb0')

    expect(result).toMatchObject({
      type: 'video',
      allow_download: false,
      is_embeddable: true,
      format: 'mp4',
      bytes: 1000000,
      metadata: { duration: 10, resolution: '1080p' },
    })
  }

  @test
  async '[provision] Should return provisioned Link content'() {
    this.mockContentEntity = ContentModelToEntityAdapter.adapt(
      this.mockContent('link', null, 'https://example.com'),
    )

    jest.spyOn(this.contentRepository, 'findOne').mockResolvedValue(this.mockContentEntity)

    const result = await this.contentService.provision('4372ebd1-2ee8-4501-9ed5-549df46d0eb0')

    expect(result).toMatchObject({
      type: 'link',
      allow_download: false,
      is_embeddable: true,
      format: null,
      bytes: 0,
      metadata: { trusted: true },
    })
  }

  @test
  async '[provision] Should return provisioned Link content with default url'() {
    this.mockContentEntity = ContentModelToEntityAdapter.adapt(this.mockContent('link', null, ''))
    this.mockContentEntity.setUrl(null)

    jest.spyOn(this.contentRepository, 'findOne').mockResolvedValue(this.mockContentEntity)

    const result = await this.contentService.provision('4372ebd1-2ee8-4501-9ed5-549df46d0eb0')

    expect(result.url).toBe('http://default.com')
  }

  @test
  async '[provision] Should return provisioned Text content'() {
    this.mockContentEntity = ContentModelToEntityAdapter.adapt(
      this.mockContent('text', 'txt', 'http://localhost:3000/uploads/text-uol.txt'),
    )

    jest.spyOn(this.contentRepository, 'findOne').mockResolvedValue(this.mockContentEntity)

    const result = await this.contentService.provision('4372ebd1-2ee8-4501-9ed5-549df46d0eb0')

    expect(result).toMatchObject({
      type: 'text',
      allow_download: true,
      is_embeddable: true,
      format: 'txt',
      bytes: 0,
      metadata: { size: 0, creator: 'Unknown' },
    })
  }

  @test
  async '[provision] Should throw BadRequestException for unsupported content type'() {
    this.mockContentEntity.setType('unsupported')
    jest.spyOn(this.contentRepository, 'findOne').mockResolvedValue(this.mockContentEntity)

    await expect(
      this.contentService.provision('4372ebd1-2ee8-4501-9ed5-549df46d0eb0'),
    ).rejects.toThrow(BadRequestException)
  }
}
