import { describe, expect, test, vi } from 'vitest'
import { type Validation, type HttpRequest, type AddSurvey, type AddSurveyModel } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any-question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null { return null }
  }
  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      await new Promise<void>(resolve => { resolve() })
    }
  }
  return new AddSurveyStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = vi.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = vi.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    vi.spyOn(addSurveyStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(noContent())
  })
})
