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

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      const surveyData = makeFakeSurveyData()
      await sut.add(surveyData)
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      },
      {
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }],
        date: new Date()
      }])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys!.length).toBe(2)
      expect(surveys![0].question).toBe('any_question')
      expect(surveys![1].question).toBe('other_question')
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys!.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      })
      const id = res.insertedId.toString()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
    })
  })
})
