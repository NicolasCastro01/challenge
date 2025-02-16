import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { suite, test } from '@testdeck/jest'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { ENV } from 'test/constants/config'

@suite
export class ContentResolverIntegrationTest {
  private app: INestApplication
  private readonly contentIdValid = 'a3f8d5e6-4c2b-47d1-8e9a-1f0c23bfa5d3'
  private readonly tokenValid = ENV.TOKEN_VALID

  async before() {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    this.app = moduleFixture.createNestApplication()
    await this.app.init()
  }

  async after() {
    await this.app.close()
  }

  @test
  async 'should return provisioning data for a valid content_id'() {
    const query = `
      query {
        provision(content_id: "${this.contentIdValid}") {
          id
          title
          type
        }
      }
    `

    const response = await request(this.app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${this.tokenValid}`)
      .send({ query })
      .expect(200)

    expect(response.body.data.provision).toBeDefined()
    expect(response.body.errors).toBeUndefined()
  }
}
