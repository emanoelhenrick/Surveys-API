import { describe, expect, test, vitest } from 'vitest'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface Sut {
  sut: BcryptAdapter
  salt: number
}

const makeSut = (): Sut => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut,
    salt
  }
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = vitest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a valid hash on hash success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    expect(bcrypt.compareSync('any_value', hash))
      .toBeTruthy()
  })

  test('Should throws if bcrypt throws', async () => {
    const { sut } = makeSut()

    vitest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(async () =>
        await new Promise((resolve, reject) => {
          reject(new Error())
        }))

    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = vitest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Should return true when compare succeeds', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    const isValid = await sut.compare('any_value', hash)
    expect(isValid).toBeTruthy()
  })

  test('Should return false when compare succeeds', async () => {
    const { sut } = makeSut()
    const isValid = await sut.compare('invalid_value', 'any_hash')
    expect(isValid).toBeFalsy()
  })
})
