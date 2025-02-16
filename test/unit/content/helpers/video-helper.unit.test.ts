import { suite, test } from '@testdeck/jest'
import { expect } from '@jest/globals'
import { VideoHelper } from '@/content/helper'
import * as path from 'node:path'

jest.mock('node:path', () => ({
  extname: jest.fn(),
}))

@suite
export class VideoHelperUnitTest {
  @test
  'Should return the correct format from extension'() {
    ;(path.extname as jest.Mock).mockReturnValue('.avi')

    const format = VideoHelper.getFormatFromExtension('video.avi')
    expect(format).toBe('avi')
  }

  @test
  'Should return "mp4" when extension is null'() {
    ;(path.extname as jest.Mock).mockReturnValue('')

    const format = VideoHelper.getFormatFromExtension('')
    expect(format).toBe('mp4')
  }

  @test
  'Should calculate the correct duration based on byte size'() {
    const duration = VideoHelper.getDurationFromBytes(500000)
    expect(duration).toBe(5)
  }

  @test
  'Should return 10 when byte size is zero'() {
    const duration = VideoHelper.getDurationFromBytes(0)
    expect(duration).toBe(10)
  }
}
