import { DbAddAccount } from '../../data/usecases/add-account/usecase'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { type Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const SALT = 12

  const emailValidator = new EmailValidatorAdapter()
  const encrypter = new BcryptAdapter(SALT)
  const accountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, accountRepository)
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(emailValidator, addAccount, validationComposite)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
