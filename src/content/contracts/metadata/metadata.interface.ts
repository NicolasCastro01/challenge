export type MetadataTypes = 'pdf' | 'image' | 'video' | 'link' | 'text'

interface MetadataPDF {
  author?: string
  pages: number
  encrypted: boolean
}

interface MetadataImage {
  resolution: string
  aspect_ratio: string
}

interface MetadataVideo {
  duration: number
  resolution: string
}

interface MetadataLink {
  trusted: boolean
}

interface MetadataText {
  size: number
  creator: string
}

type MetadataMap = {
  pdf: MetadataPDF
  image: MetadataImage
  video: MetadataVideo
  link: MetadataLink
  text: MetadataText
}

export type Metadata<T extends MetadataTypes> = MetadataMap[T]
