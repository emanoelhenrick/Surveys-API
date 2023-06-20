import { type AuthenticationModel, type Authentication } from '../../../domain/usecases/authentication'
import { type HashComparer } from '../../protocols/criptography/hash-comparer'
import { type TokenGenerator } from '../../protocols/criptography/token-generator'
import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null
    const isValid = await this.hashComparer.compare(authentication.password, account.password)
    if (!isValid) return null
    return await this.tokenGenerator.generate(account.id)
  }
}
