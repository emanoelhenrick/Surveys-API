import { describe, expect, test, vitest } from 'vitest'
import { DbAddAccount } from './db-add-account'
import { type Encrypter } from '../../protocols/Encrypter'

describe('DbAddAccount Usecase', () => {
  test('Should call encrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt (password: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_password') })
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)

    const encryptSpy = vitest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
