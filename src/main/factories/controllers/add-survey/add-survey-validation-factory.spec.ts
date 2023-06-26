import { describe, expect, test, vitest } from 'vitest'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { type Validation } from '../../../../presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'

vitest.mock('../../../../validation/validators/validation-composite')

describe('addSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
