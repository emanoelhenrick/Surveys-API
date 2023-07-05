import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '../../../../main/config/env'
import { type Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { type AddSurveyModel } from '../../../../domain/usecases/add-survey'

const MONGO_URL = env.mongoUrl
let surveyCollection: Collection

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any-image',
    answer: 'any_answer'
  },
  {
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL!, 'dev')
  })

  afterAll(async () => {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.drop()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  test('Should add a survey on success', async () => {
    const sut = makeSut()
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
