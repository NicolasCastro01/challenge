import path from 'node:path'

export class ImageHelper {
  static getFormatFromUrl(url: string): string {
    return path.extname(url || '').slice(1) || 'jpg'
  }
}
