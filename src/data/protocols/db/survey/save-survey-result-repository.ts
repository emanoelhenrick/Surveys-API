import { type SurveyResultModel } from '../../../../domain/models/survey-result'
import { type SaveSurveyResultModel } from '../../../../domain/usecases/save-survey-result'

export interface SaveSurveyResultRepository {
  save (date: SaveSurveyResultModel): Promise<SurveyResultModel>
}
