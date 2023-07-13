import { type LoadSurveyById, type LoadSurveyByIdRepository, type SurveyModel } from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<SurveyModel | null> {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey
  }
}
