import { describe, expect, test, vi } from 'vitest'
import { DbAddSurvey } from './db-add-survey'
import { type AddSurveyModel } from '../../../domain/usecases/add-survey'
import { type AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any-image',
    answer: 'any_answer'
  }]
})

describe('DbAddSurvey Usecase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (surveyData: AddSurveyModel): Promise<void> {
        await new Promise<void>(resolve => { resolve() })
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    const surveyData = makeFakeSurveyData()
    const addSpy = vi.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})
