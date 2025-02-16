import { ContentRepository as ContentRepositoryContract } from '@/content/contracts/repository'
import { Content } from '@/content/entity'
import { ContentRepository as ContentRepositoryProvider } from '@/content/providers/repository'
import { Test, TestingModule } from '@nestjs/testing'
import { suite, test } from '@testdeck/jest'
import { ContentRepository } from 'src/content/repository'
import { DataSource } from 'typeorm'

@suite
export class ContentRepositoryUnitTest {
  private contentRepository: ContentRepositoryContract
  private dataSource: DataSource

  private readonly mockContent: Content = {
    id: '4372ebd1-2ee8-4501-9ed5-549df46d0eb0',
    title: 'Sample Content',
    description: 'Test Description',
    url: 'http://localhost:3000/uploads/dummy.pdf',
    created_at: new Date('2025-01-31T23:39:54.236Z'),
    total_likes: 10,
    type: 'pdf',
  } as Content

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

    this.contentRepository = module.get<ContentRepository>(ContentRepository)
    this.dataSource = module.get<DataSource>(DataSource)
  }

  @test
  async '[findOne] Should return content when found'() {
    jest.spyOn(this.dataSource, 'query').mockResolvedValue([this.mockContent])

    const result = await this.contentRepository.findOne(this.mockContent.id)

    expect(this.dataSource.query).toHaveBeenCalledWith(
      `SELECT * FROM contents WHERE id = '${this.mockContent.id}' AND deleted_at IS NULL LIMIT 1`,
    )
    expect(result).toStrictEqual(this.mockContent)
  }

  @test
  async '[findOne] Should return null if content is not found'() {
    jest.spyOn(this.dataSource, 'query').mockResolvedValue([])

    const result = await this.contentRepository.findOne('non-existent-id')

    expect(this.dataSource.query).toHaveBeenCalledWith(
      `SELECT * FROM contents WHERE id = 'non-existent-id' AND deleted_at IS NULL LIMIT 1`,
    )
    expect(result).toBeNull()
  }

  @test
  async '[findOne] Should throw error if database query fails'() {
    jest.spyOn(this.dataSource, 'query').mockRejectedValue(new Error('Database error'))

    await expect(this.contentRepository.findOne(this.mockContent.id)).rejects.toThrow(
      'Database error',
    )
  }
}
