import { suite, test } from '@testdeck/jest'
import { expect } from '@jest/globals'
import { Entity } from '@/content/core/entity'

interface SampleProps {
  name: string
  value: number
}

class SampleEntity extends Entity<SampleProps> {
  constructor(props: SampleProps, identity?: string) {
    super(props, identity)
  }
}

@suite
export class EntityUnitTest {
  @test
  'Should return the correct identity'() {
    const entity = new SampleEntity({ name: 'Test', value: 42 }, '12345')
    expect(entity.getIdentity()).toBe('12345')
  }

  @test
  'Should return null if identity is not provided'() {
    const entity = new SampleEntity({ name: 'Test', value: 42 })
    expect(entity.getIdentity()).toBeUndefined()
  }

  @test
  'Should return the correct properties'() {
    const props = { name: 'Test', value: 42 }
    const entity = new SampleEntity(props)
    expect(entity.getProps()).toEqual(props)
  }

  @test
  'Should return true when comparing two entities with the same properties'() {
    const props = { name: 'Test', value: 42 }
    const entity1 = new SampleEntity(props, '123')
    const entity2 = new SampleEntity(props, '123')
    expect(entity1.equals(entity2)).toBe(true)
  }

  @test
  'Should return false when comparing two entities with different properties'() {
    const entity1 = new SampleEntity({ name: 'Test', value: 42 }, '123')
    const entity2 = new SampleEntity({ name: 'Test', value: 43 }, '123')
    expect(entity1.equals(entity2)).toBe(false)
  }

  @test
  'Should return false when comparing with a null object'() {
    const entity = new SampleEntity({ name: 'Test', value: 42 }, '123')
    expect(entity.equals(null)).toBe(false)
  }

  @test
  'Should return true when comparing the same entity instance'() {
    const entity = new SampleEntity({ name: 'Test', value: 42 }, '123')
    expect(entity.equals(entity)).toBe(true)
  }
}
