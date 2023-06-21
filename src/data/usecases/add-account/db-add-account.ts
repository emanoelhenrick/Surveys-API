import { type Hasher, type AccountModel, type AddAccount, type AddAccountModel, type AddAccountRepository } from './db-add-account-procotols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly Hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.Hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return account
  }
}
