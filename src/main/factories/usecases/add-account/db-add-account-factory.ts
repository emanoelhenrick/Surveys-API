import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account'
import { type AddAccount } from '../../../../domain/usecases/add-account'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const SALT = 12
  const Hasher = new BcryptAdapter(SALT)
  const accountRepository = new AccountMongoRepository()
  return new DbAddAccount(Hasher, accountRepository)
}
