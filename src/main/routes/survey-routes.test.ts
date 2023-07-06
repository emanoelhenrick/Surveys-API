import request from 'supertest'
import { afterAll, beforeAll, describe, test, beforeEach } from 'vitest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'
import app from '../config/app'
import { ObjectId, type Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (role?: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Manel',
    email: 'manel@email.com',
    password: '123456',
    role
  })
  const id = res.insertedId.toString()
  const accessToken = sign({ id }, env.jwt_secret)
  await accountCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { accessToken } })
  return accessToken
}

describe('Survey Routes', () => {
  const MONGO_URL = env.mongoUrl

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL!, 'dev')
    await request(app).post('/api/surveys')
    await request(app).get('/api/surveys')
  })

  beforeEach(async () => {
    await request(app).post('/api/surveys')
    await request(app).get('/api/surveys')
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    if (accountCollection) await accountCollection.deleteMany({})
    if (surveyCollection) await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    if (accountCollection) await accountCollection.drop()
    if (surveyCollection) await surveyCollection.drop()
    await MongoHelper.disconnect()
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            { answer: 'Answer 1', image: 'http://image-name.com' },
            { answer: 'Answer 2' }]
        })
        .expect(403)
    })

    test('Should return 204 if valid token', async () => {
      const accessToken = await makeAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            { answer: 'Answer 1', image: 'http://image-name.com' },
            { answer: 'Answer 2' }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without access token', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
