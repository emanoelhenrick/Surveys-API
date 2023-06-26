import request from 'supertest'
import { afterAll, beforeAll, describe, test, beforeEach } from 'vitest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'
import app from '../config/app'
import { type Collection } from 'mongodb'

let surveyCollection: Collection

describe('Survey Routes', () => {
  const MONGO_URL = env.mongoUrl

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL!, 'dev')
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.drop()
    await MongoHelper.disconnect()
  })

  describe('POST /surveys', () => {
    test('Should return 204 on add survey success', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(204)
    })
  })
})
