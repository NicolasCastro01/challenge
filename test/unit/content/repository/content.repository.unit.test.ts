import { Content as ContentModel } from '@/content/entity'
import { ContentRepository } from 'src/content/repository'
import { ContentRepository as ContentRepositoryProvider } from '@/content/providers/repository'
import { ContentRepositoryContract } from '@/content/contracts/repository'
import { DataSource } from 'typeorm'
import { suite, test } from '@testdeck/jest'
import { Test, TestingModule } from '@nestjs/testing'
import { Content } from '@/content/core'
import { ContentModelToEntityAdapter } from '@/content/adapters/contentModelToEntity.adapter'
import { NotFoundException } from '@nestjs/common'

@suite
export class ContentRepositoryUnitTest {
  private contentRepository: ContentRepositoryContract
  private dataSource: DataSource

  private readonly mockContentModel: ContentModel = {
    id: '4372ebd1-2ee8-4501-9ed5-549df46d0eb0',
    title: 'Sample Content',
    description: 'Test Description',
    url: 'http://localhost:3000/uploads/dummy.pdf',
    created_at: new Date('2025-01-31T23:39:54.236Z'),
    total_likes: 10,
    type: 'pdf',
  } as ContentModel

  private readonly mockContentEntity: Content<'pdf'> = ContentModelToEntityAdapter.adapt(
    this.mockContentModel,
  )

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ContentRepositoryProvider,
          useClass: ContentRepository,
        },
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile()

    this.contentRepository = module.get<ContentRepository>(ContentRepositoryProvider)
    this.dataSource = module.get<DataSource>(DataSource)
  }

  @test
  async '[findOne] Should return content when found'() {
    jest.spyOn(this.dataSource, 'query').mockResolvedValue([this.mockContentModel])

    const result = await this.contentRepository.findOne(this.mockContentModel.id)

    expect(this.dataSource.query).toHaveBeenCalledWith(
      `SELECT * FROM contents WHERE id = '${this.mockContentModel.id}' AND deleted_at IS NULL LIMIT 1`,
    )
    expect(result).toStrictEqual(this.mockContentEntity)
    expect(result.getIdentity()).toBe(this.mockContentModel.id)
  }

  @test
  async '[findOne] Should throw not found error if content is not found'() {
    jest.spyOn(this.dataSource, 'query').mockResolvedValue([])

    try {
      const result = await this.contentRepository.findOne('non-existent-id')

      expect(this.dataSource.query).toHaveBeenCalledWith(
        `SELECT * FROM contents WHERE id = 'non-existent-id' AND deleted_at IS NULL LIMIT 1`,
      )
      await expect(result).rejects.toThrow(NotFoundException)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe(
        'Database error: NotFoundException: Content not found: non-existent-id',
      )
    }
  }

  @test
  async '[findOne] Should throw error if database query fails'() {
    jest.spyOn(this.dataSource, 'query').mockRejectedValue(new Error('Database error'))

    await expect(this.contentRepository.findOne(this.mockContentModel.id)).rejects.toThrow(
      'Database error',
    )
  }
}
