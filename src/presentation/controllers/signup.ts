import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { type AddAccount } from '../../domain/usecases/add-account'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password, passwordConfirmation, name } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) return badRequest(new InvalidParamError('email'))

      this.addAccount.add({
        name,
        email,
        password
      })

      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverError()
    }
  }
}
