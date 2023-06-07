import { type AccountModel } from '../../../domain/models/account'
import { type AddAccount, type AddAccountModel } from '../../../domain/usecases/add-account'
import { type Encrypter } from '../../protocols/Encrypter'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => { resolve(null) })
  }
}
