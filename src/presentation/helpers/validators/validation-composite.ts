import { type Validation } from './validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

  validate (input: any): Error | true {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error instanceof Error) return error
    }
    return true
  }
}
