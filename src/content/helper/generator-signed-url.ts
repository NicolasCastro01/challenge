export class GeneratorSignedURL {
  private static readonly expirationTime = 3600 // 1 hour

  static generateByOriginalURL(originalUrl: string) {
    const expires = Math.floor(Date.now() / 1000) + this.expirationTime
    const signature = this.generateSignature()

    return `${originalUrl}?expires=${expires}&signature=${signature}`
  }

  private static generateSignature() {
    return Math.random().toString(36).substring(2, 9)
  }
}
