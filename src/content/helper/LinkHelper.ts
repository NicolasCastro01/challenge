export class LinkHelper {
  static checkTrustByUrl(url: string): boolean {
    return url?.includes('https') || false
  }
}
