import { suite, test } from '@testdeck/jest'
import { expect } from '@jest/globals'
import { GeneratorSignedURL } from '@/content/helper'

@suite
export class GeneratorSignedURLUnitTest {
  @test
  'Should generate a signed URL with expiration and signature'() {
    const originalUrl = 'http://example.com/resource'
    const signedUrl = GeneratorSignedURL.generateByOriginalURL(originalUrl)

    expect(signedUrl).toMatch(/^http:\/\/example\.com\/resource\?expires=\d+&signature=\w+$/)
  }

  @test
  'Should include an expiration time 1 hour from now'() {
    const originalUrl = 'http://example.com/resource'
    const signedUrl = GeneratorSignedURL.generateByOriginalURL(originalUrl)

    const url = new URL(signedUrl)
    const expires = parseInt(url.searchParams.get('expires') || '0', 10)
    const currentTime = Math.floor(Date.now() / 1000)

    expect(expires).toBeGreaterThan(currentTime)
    expect(expires).toBeLessThanOrEqual(currentTime + 3600)
  }

  @test
  'Should include a non-empty signature parameter'() {
    const originalUrl = 'http://example.com/resource'
    const signedUrl = GeneratorSignedURL.generateByOriginalURL(originalUrl)

    const url = new URL(signedUrl)
    const signature = url.searchParams.get('signature')

    expect(signature).toBeDefined()
    expect(signature).not.toHaveLength(0)
  }
}
