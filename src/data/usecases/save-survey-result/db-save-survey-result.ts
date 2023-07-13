import { type SaveSurveyResult, type SaveSurveyResultModel, type SaveSurveyResultRepository, type SurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel | null> {
    const result = await this.saveSurveyResultRepository.save(data)
    return result
  }
}
