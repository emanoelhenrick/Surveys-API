import { type AddSurvey, type AddSurveyModel } from '../../../domain/usecases/add-survey'
import { type AddSurveyRepository } from './db-add-survey-procotols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (data: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
