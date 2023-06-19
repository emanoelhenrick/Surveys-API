import { describe, expect, test } from 'vitest'
import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors'

describe('Required Field Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should return true if validation succeeds', () => {
    const sut = new RequiredFieldValidation('any_field')
    const response = sut.validate({ any_field: 'field' })
    expect(response).toBeNull()
  })
})
