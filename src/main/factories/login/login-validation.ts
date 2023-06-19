import { EmailValidation } from '../../../presentation/helpers/validators/email-validation.js'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation.js'
import { type Validation } from '../../../presentation/protocols/validation.js'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite.js'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter.js'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
