import { describe, expect, test, vi, vitest } from 'vitest'
import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

vi.mock('validator', async () => {
  const actual: object = await vi.importActual('validator')
  return { ...actual, isEmail (): boolean { return true } }
})

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    vitest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBeFalsy()
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBeTruthy()
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = vitest.spyOn(validator, 'isEmail')
    sut.isValid('any_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
