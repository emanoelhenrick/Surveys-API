import { InvalidParamError } from '../../errors'
import { type Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate (input: any): Error | true {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
    return true
  }
}
