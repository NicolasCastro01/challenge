export class PDFHelper {
  static countPagesFromBytes(bytes: number): number {
    return Math.floor(bytes / 50000) || 1
  }
}
