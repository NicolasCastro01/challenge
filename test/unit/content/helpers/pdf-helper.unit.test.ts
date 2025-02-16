import { suite, test } from '@testdeck/jest'
import { PDFHelper } from '@/content/helper'

@suite
export class PDFHelperUnitTest {
  @test
  'Should correctly calculate the number of pages based on byte size'() {
    const pages = PDFHelper.countPagesFromBytes(150000)
    expect(pages).toBe(3)
  }

  @test
  'Should return 1 when byte size is zero'() {
    const pages = PDFHelper.countPagesFromBytes(0)
    expect(pages).toBe(1)
  }

  @test
  'Should return 1 when byte size is less than 50000'() {
    const pages = PDFHelper.countPagesFromBytes(30000)
    expect(pages).toBe(1)
  }

  @test
  'Should handle large byte sizes correctly'() {
    const pages = PDFHelper.countPagesFromBytes(1000000)
    expect(pages).toBe(20)
  }
}
