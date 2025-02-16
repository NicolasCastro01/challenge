import { Content } from '@/content/core'
import { MetadataTypes } from '@/content/contracts/metadata'
import { BadRequestException } from '@nestjs/common'
import {
  PDFProvisioner,
  VideoProvisioner,
  ImageProvisioner,
  LinkProvisioner,
  TextProvisioner,
} from '@/content/strategy'
import { suite, test } from '@testdeck/jest'
import { ProvisionerFactory } from '@/content/factory'

@suite()
export class ProvisionerFactoryTests {
  private createContent(type: MetadataTypes): Content<MetadataTypes> {
    return Content.create({
      title: 'Sample Content',
      description: 'Sample Description',
      total_likes: 0,
      type,
      created_at: new Date(),
    })
  }

  @test('should return PDFProvisioner for pdf content type')
  testPDFProvisioner() {
    const content = this.createContent('pdf')
    const provisioner = ProvisionerFactory.getByContent(content)
    expect(provisioner).toBeInstanceOf(PDFProvisioner)
  }

  @test('should return VideoProvisioner for video content type')
  testVideoProvisioner() {
    const content = this.createContent('video')
    const provisioner = ProvisionerFactory.getByContent(content)
    expect(provisioner).toBeInstanceOf(VideoProvisioner)
  }

  @test('should return ImageProvisioner for image content type')
  testImageProvisioner() {
    const content = this.createContent('image')
    const provisioner = ProvisionerFactory.getByContent(content)
    expect(provisioner).toBeInstanceOf(ImageProvisioner)
  }

  @test('should return LinkProvisioner for link content type')
  testLinkProvisioner() {
    const content = this.createContent('link')
    const provisioner = ProvisionerFactory.getByContent(content)
    expect(provisioner).toBeInstanceOf(LinkProvisioner)
  }

  @test('should return TextProvisioner for text content type')
  testTextProvisioner() {
    const content = this.createContent('text')
    const provisioner = ProvisionerFactory.getByContent(content)
    expect(provisioner).toBeInstanceOf(TextProvisioner)
  }

  @test('should throw BadRequestException for unsupported content type')
  testUnsupportedContentType() {
    const content = this.createContent('unsupported' as MetadataTypes)
    expect(() => ProvisionerFactory.getByContent(content)).toThrow(BadRequestException)
  }
}
