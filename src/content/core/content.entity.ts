import { Metadata, MetadataTypes } from '@/content/contracts/metadata'
import { Entity } from '@/content/core/entity'
import { GeneratorSignedURL } from '@/content/helper/generator-signed-url'
import { Logger } from '@nestjs/common'
import * as fs from 'fs'

interface ContentProps<Type extends MetadataTypes> {
  title: string
  cover?: string
  description: string
  total_likes: number
  type: string
  url?: string
  allow_download?: boolean
  is_embeddable?: boolean
  format?: string
  bytes?: number
  created_at: Date
  metadata?: Metadata<Type>
}

export class Content<Type extends MetadataTypes> extends Entity<ContentProps<Type>> {
  private readonly logger = new Logger(Content.name)

  private constructor(props: ContentProps<Type>, id?: string) {
    super(props, id)
    this.refreshPropsByUrl()
  }

  public static create<Type extends MetadataTypes>(props: ContentProps<Type>): Content<Type> {
    return new Content(props)
  }

  public static restore<Type extends MetadataTypes>(
    props: ContentProps<Type>,
    id: string,
  ): Content<Type> {
    return new Content(props, id)
  }

  public getTitle(): string {
    return this.getProps().title
  }

  public getCover(): string {
    return this.getProps().cover
  }

  public getDescription(): string {
    return this.getProps().description
  }

  public getTotalLikes(): number {
    return this.getProps().total_likes
  }

  public getType(): string {
    return this.getProps().type
  }

  public getURLRaw(): string {
    return this.removeQueryParamsFromURL()
  }

  public getUrl(): string {
    return this.getProps().url
  }

  public getAllowDownload(): boolean {
    return this.getProps().allow_download
  }

  public getIsEmbeddable(): boolean {
    return this.getProps().is_embeddable
  }

  public getFormat(): string {
    return this.getProps().format
  }

  public getBytes(): number {
    return this.getProps().bytes
  }

  public getCreatedAt(): Date {
    return this.getProps().created_at
  }

  public getMetadata(): Metadata<Type> | null {
    return this.getProps().metadata
  }

  public hasNotProtocol(): boolean {
    return !this.hasProtocol()
  }

  public hasProtocol(): boolean {
    return this.getUrl()?.startsWith('http')
  }

  public setMetadata(metadata: Metadata<Type>): void {
    this.getProps().metadata = metadata
  }

  public activateDownload(): void {
    this.getProps().allow_download = true
  }

  public deactivateDownload(): void {
    this.getProps().allow_download = false
  }

  public activateEmbed(): void {
    this.getProps().is_embeddable = true
  }

  public deactivateEmbed(): void {
    this.getProps().is_embeddable = false
  }

  public setType(type: string): void {
    this.getProps().type = type
  }

  public setFormat(format: string): void {
    this.getProps().format = format
  }

  public setUrl(url: string): void {
    this.getProps().url = url
    this.refreshPropsByUrl()
  }

  public setLink(): void {
    this.getProps().url = GeneratorSignedURL.generateByOriginalURL(this.getUrl())
  }

  private contentIsNotFound(): boolean {
    return !fs.existsSync(this.getUrl())
  }

  private getFileSize(): number {
    return fs.statSync(this.getUrl()).size
  }

  private refreshPropsByUrl(): void {
    this.setBytes()
  }

  private setBytes(): void {
    this.getProps().bytes = this.extractBytesFromFile()
  }

  private extractBytesFromFile(): number {
    try {
      if (this.contentIsNotFound()) return 0

      return this.getFileSize()
    } catch (error) {
      this.logger.error(`File system error: ${error}`)
    }
  }

  private removeQueryParamsFromURL(): string {
    return this.getProps().url?.split('?')[0]
  }
}
