import { describe, expect, test, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
  vi.spyOn(jwt, 'sign')
    .mockImplementation(() => 'any_token')

  vi.spyOn(jwt, 'verify')
    .mockImplementation(() => 'any_value')

  describe('sing()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = vi.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_id')

      expect(accessToken).toEqual('any_token')
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'sign')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = vi.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return a value on verify success', async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'verify')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })
  })
})
