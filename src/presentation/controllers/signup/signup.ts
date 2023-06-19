import { type Controller, type HttpRequest, type HttpResponse, type AddAccount, type Validation } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error instanceof Error) return badRequest(error)
      const { email, password, name } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
