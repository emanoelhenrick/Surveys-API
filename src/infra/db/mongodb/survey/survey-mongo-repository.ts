import { ObjectId } from 'mongodb'
import { type AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { type LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-survey-repository'
import { type LoadSurveyByIdRepository } from '../../../../data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'
import { type SurveyModel } from '../../../../domain/models/survey'
import { type AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (SurveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(SurveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys as unknown as SurveyModel[]
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey as unknown as SurveyModel
  }
}
