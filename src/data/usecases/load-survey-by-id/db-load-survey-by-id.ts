import { type SurveyModel } from '../../../domain/models/survey'
import { type LoadSurveyById } from '../../../domain/usecases/load-survey-by-id'
import { type LoadSurveyByIdRepository } from '../../protocols/db/survey/load-survey-by-id-repository'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<SurveyModel | null> {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey
  }
}
