import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import { type Validation, type Controller, type HttpRequest, type HttpResponse, type AddSurvey } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error instanceof Error) return badRequest(new Error())
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({ question, answers })
      return noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
