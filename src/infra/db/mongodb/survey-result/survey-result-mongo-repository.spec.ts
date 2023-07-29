import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '../../../../main/config/env'
import { type Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { type SurveyModel } from '../../../../domain/models/survey'
import { type AccountModel } from '../../../../domain/models/account'

const MONGO_URL = env.mongoUrl
let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

// const makeFakeSurveyData = (): AddSurveyModel => ({
//   question: 'any_question',
//   answers: [{
//     image: 'any-image',
//     answer: 'any_answer'
//   },
//   {
//     answer: 'any_answer'
//   }],
//   date: new Date()
// })

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL!, 'dev')
  })

  afterAll(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.drop()

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.drop()

    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.drop()

    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  const makeSurvey = async (): Promise<SurveyModel> => {
    const res = await surveyCollection.insertOne({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    })
    const survey = await surveyCollection.findOne({
      _id: res.insertedId
    })
    return MongoHelper.map<SurveyModel>(survey)
  }

  const makeAccount = async (): Promise<AccountModel> => {
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const account = await accountCollection.findOne({
      _id: res.insertedId
    })
    return MongoHelper.map<AccountModel>(account)
  }

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })
  })
})
