import {
  type Authentication,
  type AuthenticationModel,
  type HashComparer,
  type LoadAccountByEmailRepository,
  type Encrypter,
  type UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly Encrypter: Encrypter,
    private readonly UpdateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null
    const isValid = await this.hashComparer.compare(authentication.password, account.password)
    if (!isValid) return null
    const accessToken = await this.Encrypter.encrypt(account.id)
    await this.UpdateAccessTokenRepository.updateAccessToken(account.id, accessToken)
    return accessToken
  }
}
