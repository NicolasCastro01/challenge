import { suite, test } from '@testdeck/jest'
import { LinkHelper } from '@/content/helper'

@suite
export class LinkHelperUnitTest {
  @test
  'should return true for URLs containing https'() {
    const result = LinkHelper.checkTrustByUrl('https://example.com')
    expect(result).toBe(true)
  }

  @test
  'should return false for URLs not containing https'() {
    const result = LinkHelper.checkTrustByUrl('http://example.com')
    expect(result).toBe(false)
  }

  @test
  'should return false for undefined URLs'() {
    const result = LinkHelper.checkTrustByUrl(undefined)
    expect(result).toBe(false)
  }
}
