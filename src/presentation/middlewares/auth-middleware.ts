import { type LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http/http-helper'
import { type HttpRequest, type HttpResponse, type Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (!accessToken) return forbidden(new AccessDeniedError())
    const account = await this.loadAccountByToken.load(accessToken)
    if (!account) return forbidden(new AccessDeniedError())
    return ok({ accountId: account.id })
  }
}
