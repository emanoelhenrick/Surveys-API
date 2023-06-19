// import request from 'supertest'

import { afterAll, beforeAll, describe, test, beforeEach } from 'vitest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'
// import app from '../config/app'

describe('SignUp Routes', () => {
  const MONGO_URL = env.mongoUrl

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL, 'dev')
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    // const accountCollection = await MongoHelper.getCollection('accounts')
    // await accountCollection.drop()
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async () => {
    // await request(app)
    //   .post('/api/signup')
    //   .send({
    //     name: 'Manel',
    //     email: 'manel@mail.com',
    //     password: '123456',
    //     passwordConfirmation: '123456'
    //   })
    //   .expect(200)
  })
})
