import * as path from 'node:path'

export class VideoHelper {
  static getFormatFromExtension(extension: string = ''): string {
    return path.extname(extension || '').slice(1) || 'mp4'
  }

  static getDurationFromBytes(bytes: number): number {
    return Math.floor(bytes / 100000) || 10
  }
}
