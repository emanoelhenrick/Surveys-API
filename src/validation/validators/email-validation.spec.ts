import { type EmailValidator } from '../protocols/email-validator'
import { InvalidParamError, ServerError } from '../../presentation/errors'
import { describe, expect, test, vitest } from 'vitest'
import { EmailValidation } from './email-validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('Should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = vitest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'valid_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    vitest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new ServerError(null as unknown as string) })
    expect(sut.validate).toThrow()
  })

  test('Should return an error if EmailValidator returns an false', () => {
    const { sut, emailValidatorStub } = makeSut()
    vitest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'valid_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })
})
