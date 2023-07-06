import { type AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { type LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-survey-repository'
import { type SurveyModel } from '../../../../domain/models/survey'
import { type AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (SurveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(SurveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys as unknown as SurveyModel[]
  }
}
