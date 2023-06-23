import { describe, expect, test } from 'vitest'
import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('Compare Fields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'invalid_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should return true if validation succeeds', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')
    const response = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })
    expect(response).toBeNull()
  })
})
