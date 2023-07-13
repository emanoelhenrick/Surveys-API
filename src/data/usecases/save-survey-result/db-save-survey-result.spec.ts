import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { type SaveSurveyResultModel } from '../../../domain/usecases/save-survey-result'
import { type SurveyResultModel } from '../../../domain/models/survey-result'
import { type SaveSurveyResultRepository } from '../../protocols/db/survey/save-survey-result-repository'

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => Object.assign(
  {}, makeFakeSurveyResultData(), { id: 'any_id' })

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeFakeSurveyResult()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = vi.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResultData = makeFakeSurveyResultData()
    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    vi.spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockReturnValueOnce(new Promise((resolve, reject) => {
        reject(new Error())
      }))
    const promise = sut.save(makeFakeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })
})
