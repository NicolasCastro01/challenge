import { suite, test } from '@testdeck/jest'
import { GeneratorSignedURL } from '@/content/helper/generator-signed-url'
import { Metadata } from '@/content/contracts/metadata'
import * as fs from 'fs'
import { Content } from '@/content/core'

jest.mock('fs')

@suite
export class ContentUnitTest {
  private readonly mockProps = {
    title: 'Sample Content',
    description: 'Test Description',
    total_likes: 10,
    type: 'pdf',
    url: 'http://localhost:3000/uploads/dummy.pdf',
    allow_download: true,
    is_embeddable: false,
    format: 'pdf',
    bytes: 1024,
    created_at: new Date(),
    metadata: { author: 'John Doe', pages: 100, encrypted: true } as Metadata<'pdf'>,
  }

  @test
  'Should create a new Content entity successfully'() {
    const content = Content.create(this.mockProps)
    expect(content).toBeInstanceOf(Content)
  }

  @test
  'Should restore an existing Content entity successfully'() {
    const content = Content.restore(this.mockProps, '12345')
    expect(content.getIdentity()).toBe('12345')
  }

  @test
  'Should return correct title'() {
    const content = Content.create(this.mockProps)
    expect(content.getTitle()).toBe(this.mockProps.title)
  }

  @test
  'Should correctly set and retrieve metadata'() {
    const content = Content.create(this.mockProps)
    const newMetadata = { author: 'Jane Doe', pages: 200, encrypted: false } as Metadata<'pdf'>
    content.setMetadata(newMetadata)
    expect(content.getMetadata()).toBe(newMetadata)
  }

  @test
  'Should activate and deactivate download'() {
    const content = Content.create(this.mockProps)
    content.deactivateDownload()
    expect(content.getAllowDownload()).toBe(false)
    content.activateDownload()
    expect(content.getAllowDownload()).toBe(true)
  }

  @test
  'Should activate and deactivate embed'() {
    const content = Content.create(this.mockProps)
    content.deactivateEmbed()
    expect(content.getIsEmbeddable()).toBe(false)
    content.activateEmbed()
    expect(content.getIsEmbeddable()).toBe(true)
  }

  @test
  'Should generate a signed URL with correct expiration and signature'() {
    const content = Content.create(this.mockProps)
    const originalUrl = content.getUrl()
    const signedUrl = GeneratorSignedURL.generateByOriginalURL(originalUrl)

    const expiresMatch = new RegExp(/expires=(\d+)/).exec(signedUrl)
    expect(expiresMatch).not.toBeNull()
    const expires = parseInt(expiresMatch[1], 10)
    expect(expires).toBeGreaterThan(Math.floor(Date.now() / 1000))

    const signatureMatch = new RegExp(/signature=([a-z0-9]+)/).exec(signedUrl)
    expect(signatureMatch).not.toBeNull()
    const signature = signatureMatch[1]
    expect(signature).toHaveLength(7)

    expect(signedUrl).toContain(originalUrl)
  }

  @test
  'Should check if URL has protocol'() {
    const content = Content.create(this.mockProps)
    expect(content.hasProtocol()).toBe(true)
    content.setUrl('localhost/path')
    expect(content.hasProtocol()).toBe(false)
  }

  @test
  'Should return file size when file exists'() {
    const content = Content.create(this.mockProps)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 2048 } as fs.Stats)

    content.setUrl('/path/to/file.pdf')
    expect(content.getBytes()).toBe(2048)
  }

  @test
  'Should return 0 when file does not exist'() {
    const content = Content.create(this.mockProps)
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)
    content.setUrl('/invalid/path.pdf')
    expect(content.getBytes()).toBe(0)
  }

  @test
  'should handle errors in extractBytesFromFile'() {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => {
      throw new Error('Error')
    })

    try {
      Content.create(this.mockProps)
    } catch (error) {
      expect(error.message).toBe('File system error: Error')
    }
  }
}
