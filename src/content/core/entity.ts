export class Entity<T> {
  protected readonly identity?: string
  protected props: T

  protected constructor(props: T, identity?: string) {
    this.identity = identity
    this.props = props
  }

  public getIdentity(): string | null {
    return this.identity
  }

  public getProps(): T {
    return this.props
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null) {
      return false
    }
    if (this === object) {
      return true
    }
    return JSON.stringify(this.props) === JSON.stringify(object.props)
  }
}
