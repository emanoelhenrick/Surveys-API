import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '../../../../main/config/env'
import { type Collection } from 'mongodb'
import { LogMongoRepository } from './log-mongo-repository'

const makeSut = (): LogMongoRepository => new LogMongoRepository()

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl!, 'dev')
  })

  afterAll(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.drop()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})
