import { type LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { type Hasher, type AccountModel, type AddAccount, type AddAccountModel, type AddAccountRepository } from './db-add-account-procotols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly Hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const accountAlreadyExists = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    console.log(accountAlreadyExists)

    if (accountAlreadyExists) return null
    const hashedPassword = await this.Hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return account
  }
}
