import { suite, test } from '@testdeck/jest'
import { expect } from '@jest/globals'
import { ImageHelper } from '@/content/helper'
import * as path from 'node:path'

jest.mock('node:path', () => ({
  extname: jest.fn(),
}))

@suite
export class ImageHelperUnitTest {
  @test
  'Should return correct format from URL'() {
    ;(path.extname as jest.Mock).mockReturnValue('.png')

    const format = ImageHelper.getFormatFromUrl('image.png')
    expect(format).toBe('png')
  }

  @test
  'Should return "jpg" when URL is empty'() {
    ;(path.extname as jest.Mock).mockReturnValue('')

    const format = ImageHelper.getFormatFromUrl('')
    expect(format).toBe('jpg')
  }
}
