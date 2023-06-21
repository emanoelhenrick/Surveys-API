import request from 'supertest'
import { afterAll, beforeAll, describe, test, beforeEach } from 'vitest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'
import app from '../config/app'
import { type Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {
  const MONGO_URL = env.mongoUrl

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL, 'dev')
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.drop()
    await MongoHelper.disconnect()
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const passwordHashed = await hash('123456', 12)
      await accountCollection.insertOne({
        name: 'Manel',
        email: 'manel@mail.com',
        password: passwordHashed
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'manel@mail.com',
          password: '123456'
        })
        .expect(200)
    })

    test('Should return 200 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'manel@mail.com',
          password: '123456'
        })
        .expect(401)
    })
  })

  describe('POST /signup', () => {
    test('Should return an account on success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Manel',
          email: 'manel@mail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
    })
  })
})
