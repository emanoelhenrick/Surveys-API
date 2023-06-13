import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const MONGO_URL = 'mongodb://docker:docker@localhost:27017/?authMechanism=DEFAULT'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL, 'dev')
  })

  afterAll(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.drop()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on success', async () => {
    const sut = makeSut()

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toEqual(expect.any(String))
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
