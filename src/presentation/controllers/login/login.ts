import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'
import { type EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) return badRequest(new MissingParamError('email'))
    if (!password) return badRequest(new MissingParamError('password'))
    const isEmailValid = this.emailValidator.isValid(email)
    if (!isEmailValid) return badRequest(new InvalidParamError('email'))
  }
}
